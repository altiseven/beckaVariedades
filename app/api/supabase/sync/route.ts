import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

// Helper camelCase/snakeCase mapping for Clients
function mapClientToDb(client: any) {
  return {
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone || '',
    status: client.status || 'Active',
    member_since: client.memberSince || 'May 2026',
    total_spent: parseFloat(client.totalSpent || 0),
    transactions_count: parseInt(client.transactionsCount || 0)
  };
}

function mapClientFromDb(dbClient: any) {
  return {
    id: dbClient.id,
    name: dbClient.name,
    email: dbClient.email,
    phone: dbClient.phone || '',
    status: dbClient.status || 'Active',
    memberSince: dbClient.member_since || 'May 2026',
    totalSpent: parseFloat(dbClient.total_spent || 0),
    transactionsCount: parseInt(dbClient.transactions_count || 0)
  };
}

// Helper camelCase/snakeCase mapping for Products
function mapProductToDb(product: any) {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    category: product.category || 'Other',
    price: parseFloat(product.price || 0),
    stock: parseInt(product.stock || 0),
    image: product.image || '',
    series: product.series || ''
  };
}

function mapProductFromDb(dbProduct: any) {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    sku: dbProduct.sku,
    category: dbProduct.category || 'Other',
    price: parseFloat(dbProduct.price || 0),
    stock: parseInt(dbProduct.stock || 0),
    image: dbProduct.image || '',
    series: dbProduct.series || ''
  };
}

// Helper camelCase/snakeCase mapping for Transactions
function mapTransactionToDb(trx: any) {
  return {
    id: trx.id,
    client_id: trx.clientId || null,
    client_name: trx.clientName,
    status: trx.status || 'Pending',
    date: trx.date,
    amount: parseFloat(trx.amount || 0)
  };
}

function mapTransactionFromDb(dbTrx: any, items: any[] = []) {
  return {
    id: dbTrx.id,
    clientId: dbTrx.client_id || '',
    clientName: dbTrx.client_name,
    status: dbTrx.status || 'Pending',
    date: dbTrx.date,
    amount: parseFloat(dbTrx.amount || 0),
    items: items.map(i => ({
      productId: i.product_id || '',
      productName: i.product_name || '',
      qty: parseInt(i.qty || 1),
      price: parseFloat(i.price || 0)
    }))
  };
}

export async function POST(req: NextRequest) {
  try {
    const configured = isSupabaseConfigured();
    if (!configured) {
      return NextResponse.json({
        success: false,
        configured: false,
        message: 'Supabase credentials are not configured inside environment variables yet.'
      }, { status: 200 }); // Retorna 200 para evitar crashing no lado cliente
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({
        success: false,
        configured: false,
        message: 'Could not initialize Supabase connection client.'
      }, { status: 200 });
    }

    const body = await req.json();
    const { action, data } = body;

    if (!action) {
      return NextResponse.json({ success: false, error: 'No action specified' }, { status: 400 });
    }

    // ACTION: Ping config check
    if (action === 'check_config') {
      return NextResponse.json({ success: true, configured: true });
    }

    // ACTION: Secure login via Supabase Auth
    if (action === 'login') {
      const { email, password } = data || {};
      if (!email || !password) {
        return NextResponse.json({ success: false, error: 'E-mail e senha são obrigatórios.' });
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        return NextResponse.json({ success: false, error: authError.message });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: authData.user?.id,
          email: authData.user?.email,
          role: authData.user?.role,
        }
      });
    }

    // ACTION: Fetch all CRM records
    if (action === 'fetch_all') {
      const { data: dbClients, error: cErr } = await supabase.from('clients').select('*');
      const { data: dbProducts, error: pErr } = await supabase.from('products').select('*');
      const { data: dbTrxs, error: tErr } = await supabase.from('transactions').select('*');
      const { data: dbItems, error: iErr } = await supabase.from('transaction_items').select('*');

      if (cErr || pErr || tErr) {
        const errMsg = cErr?.message || pErr?.message || tErr?.message || '';
        if (errMsg.includes("Could not find the table") || errMsg.includes("relation") || errMsg.includes("does not exist")) {
          return NextResponse.json({
            success: false,
            configured: true,
            schema_missing: true,
            error: 'Tabelas não encontradas no seu projeto Supabase. Por favor, execute a migration SQL clicando em Settings no painel do CRM.'
          });
        }
        throw new Error(`Database error: ${errMsg}`);
      }

      const clientList = (dbClients || []).map(mapClientFromDb);
      const productList = (dbProducts || []).map(mapProductFromDb);

      const itemsByTx: Record<string, any[]> = {};
      const itemsList = (dbItems || []) as any[];
      itemsList.forEach((item: any) => {
        if (item && item.transaction_id) {
          if (!itemsByTx[item.transaction_id]) {
            itemsByTx[item.transaction_id] = [];
          }
          itemsByTx[item.transaction_id].push(item);
        }
      });

      const trxsList = (dbTrxs || []) as any[];
      const transactionList = trxsList.map((t: any) => mapTransactionFromDb(t, itemsByTx[t.id] || []));

      return NextResponse.json({
        success: true,
        configured: true,
        clients: clientList,
        products: productList,
        transactions: transactionList
      });
    }

    // ACTION: Client Upsert
    if (action === 'upsert_client') {
      const payload = mapClientToDb(data);
      const { error } = await (supabase.from('clients') as any).upsert(payload as any);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // ACTION: Client Delete
    if (action === 'delete_client') {
      const { error } = await (supabase.from('clients') as any).delete().eq('id', data.id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // ACTION: Product Upsert
    if (action === 'upsert_product') {
      const payload = mapProductToDb(data);
      const { error } = await (supabase.from('products') as any).upsert(payload as any);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // ACTION: Product Delete
    if (action === 'delete_product') {
      const { error } = await (supabase.from('products') as any).delete().eq('id', data.id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // ACTION: Transaction Upsert (includes items)
    if (action === 'upsert_transaction') {
      const payload = mapTransactionToDb(data);
      const { error: txErr } = await (supabase.from('transactions') as any).upsert(payload as any);
      if (txErr) throw txErr;

      // Clean old transaction items if any, then batch insert new ones
      await (supabase.from('transaction_items') as any).delete().eq('transaction_id', data.id);

      if (data.items && data.items.length > 0) {
        const itemRows = data.items.map((i: any) => ({
          transaction_id: data.id,
          product_id: i.productId || null,
          product_name: i.productName,
          qty: parseInt(i.qty),
          price: parseFloat(i.price)
        }));

        const { error: itemsErr } = await (supabase.from('transaction_items') as any).insert(itemRows as any);
        if (itemsErr) throw itemsErr;
      }

      return NextResponse.json({ success: true });
    }

    // ACTION: Transaction Delete
    if (action === 'delete_transaction') {
      const { error } = await (supabase.from('transactions') as any).delete().eq('id', data.id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // ACTION: Bulk initial sync helper from client storage to cloud DB
    if (action === 'bulk_sync') {
      const { clients: localClients, products: localProducts, transactions: localTransactions } = data;

      // Upsert all clients
      if (localClients && localClients.length > 0) {
        const payload = localClients.map(mapClientToDb);
        const { error } = await (supabase.from('clients') as any).upsert(payload as any);
        if (error) console.error('Error batch syncing clients:', error);
      }

      // Upsert all products
      if (localProducts && localProducts.length > 0) {
        const payload = localProducts.map(mapProductToDb);
        const { error } = await (supabase.from('products') as any).upsert(payload as any);
        if (error) console.error('Error batch syncing products:', error);
      }

      // Upsert all transactions
      if (localTransactions && localTransactions.length > 0) {
        for (const tx of localTransactions) {
          const txPayload = mapTransactionToDb(tx);
          await (supabase.from('transactions') as any).upsert(txPayload as any);
          
          await (supabase.from('transaction_items') as any).delete().eq('transaction_id', tx.id);
          if (tx.items && tx.items.length > 0) {
            const itemRows = tx.items.map((i: any) => ({
              transaction_id: tx.id,
              product_id: i.productId || null,
              product_name: i.productName,
              qty: parseInt(i.qty),
              price: parseFloat(i.price)
            }));
            await (supabase.from('transaction_items') as any).insert(itemRows as any);
          }
        }
      }

      return NextResponse.json({ success: true, message: 'Bulk database synchronization completed.' });
    }

    return NextResponse.json({ success: false, error: `Unsupported action: ${action}` }, { status: 400 });

  } catch (err: any) {
    console.error('Supabase Proxy API Exception:', err);
    return NextResponse.json({
      success: false,
      configured: true,
      error: err.message || 'Unknown internal database sync error'
    }, { status: 500 });
  }
}
