import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Filter, Download } from 'lucide-react';
import SalesOverview from '../components/sales/SalesOverview';
import TransactionList from '../components/sales/TransactionList';
import SalesAnalytics from '../components/sales/SalesAnalytics';
import { Transaction, DateRange } from '../types/sales';
import { squareService } from '../services/square';
import { fetchShopifyOrders } from '../services/shopify';

function Sales() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('today');

  useEffect(() => {
    fetchTransactions();
  }, [dateRange]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let allTransactions: Transaction[] = [];

      // Fetch Square transactions if configured
      if (squareService.isConfigured()) {
        try {
          const squareTransactions = await squareService.getTransactions(dateRange);
          allTransactions = [...allTransactions, ...squareTransactions];
        } catch (err) {
          console.error('Error fetching Square transactions:', err);
          setError('Failed to fetch Square transactions. Please check your configuration.');
        }
      }
      
      // Fetch Shopify orders if configured
      try {
        const shopifyConfig = JSON.parse(localStorage.getItem('shopifyConfig') || '{}');
        if (shopifyConfig.accessToken) {
          const shopifyOrders = await fetchShopifyOrders(shopifyConfig);
          allTransactions = [...allTransactions, ...shopifyOrders];
        }
      } catch (err) {
        console.error('Error fetching Shopify orders:', err);
        setError((prev) => 
          prev ? `${prev}\nFailed to fetch Shopify orders.` : 'Failed to fetch Shopify orders.'
        );
      }

      setTransactions(allTransactions);
      
      if (allTransactions.length === 0 && !error) {
        setError('No transactions found for the selected period.');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load sales data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = {
    totalSales: transactions.reduce((sum, t) => sum + t.total, 0),
    orderCount: transactions.length,
    averageOrder: transactions.length > 0 
      ? transactions.reduce((sum, t) => sum + t.total, 0) / transactions.length 
      : 0,
    onlineOrders: transactions.filter(t => t.channel === 'Online').length,
    inPersonOrders: transactions.filter(t => t.channel === 'Square').length
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  const handleExport = () => {
    const csv = [
      ['Order ID', 'Date', 'Customer', 'Total', 'Status', 'Channel'],
      ...transactions.map(t => [
        t.orderId,
        new Date(t.date).toLocaleString(),
        t.customerName,
        t.total.toFixed(2),
        t.paymentStatus,
        t.channel
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-${dateRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading sales data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
        <div className="flex space-x-4">
          <select
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value as DateRange)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      ) : (
        <>
          <SalesOverview metrics={metrics} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Recent Transactions</h2>
                <TransactionList
                  transactions={transactions}
                  onTransactionClick={setSelectedTransaction}
                />
              </div>
            </div>
            <div>
              <SalesAnalytics transactions={transactions} />
            </div>
          </div>
        </>
      )}

      {selectedTransaction && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Details - {selectedTransaction.orderId}
              </h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedTransaction.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(selectedTransaction.date).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{selectedTransaction.paymentStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Channel</p>
                  <p className="font-medium">{selectedTransaction.channel}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Items</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedTransaction.items.map(item => (
                      <tr key={item.id}>
                        <td className="py-2">{item.name}</td>
                        <td className="text-right">{item.quantity}</td>
                        <td className="text-right">${item.price.toFixed(2)}</td>
                        <td className="text-right">${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-right font-medium pt-4">Total</td>
                      <td className="text-right font-medium pt-4">
                        ${selectedTransaction.total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sales;