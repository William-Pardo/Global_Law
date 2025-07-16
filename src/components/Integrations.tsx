import React, { useState } from 'react';
import { useMetaIntegration } from '../contexts/MetaIntegrationContext';
import { useNotification } from '../contexts/NotificationContext';
import { metaApiService } from '../services/metaApiService';
import { crmService } from '../services/crmService';

const Integrations: React.FC = () => {
    const { 
      isConnected, userProfile, token, pages, forms, selectedPageId, 
      selectedFormId, loading, connect, disconnect, selectPage, saveFormSelection, getLeads
    } = useMetaIntegration();
    const { addNotification } = useNotification();
    const [accessTokenInput, setAccessTokenInput] = useState('');

    const handleConnect = async () => {
        if (!accessTokenInput.trim()) {
            addNotification('Please paste your Access Token.', 'error');
            return;
        }
        try {
            await connect(accessTokenInput);
            addNotification('Successfully connected to Meta!', 'success');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to connect.';
            addNotification(`Connection failed: ${message}`, 'error');
        }
    };
    
    const handleSyncLeads = async () => {
        if (!selectedFormId) {
            addNotification('Please select a form to sync.', 'error');
            return;
        }
        try {
            const leads = await getLeads();
            const importedIds = JSON.parse(localStorage.getItem('importedMetaLeadIds') || '[]');
            const newLeads = leads.filter(lead => !importedIds.includes(lead.id));

            if (newLeads.length === 0) {
                addNotification('No new leads to import.', 'info');
                return;
            }

            let successCount = 0;
            for (const lead of newLeads) {
                try {
                    const leadInfo = metaApiService.extractLeadInfo(lead);
                    await crmService.addClientFromMeta(leadInfo);
                    successCount++;
                } catch (importError) {
                    console.error(`Failed to import lead ${lead.id}:`, importError);
                }
            }
            
            addNotification(`Successfully imported ${successCount} new lead(s)!`, 'success');
            // Force a refresh to see new clients in other views
            setTimeout(() => window.location.reload(), 1500);

        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            addNotification(`Failed to sync leads: ${message}`, 'error');
        }
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-brand-gray">Integrations</h1>
                <p className="text-gray-600 mt-1">Connect your Meta Ads account to automatically sync new leads.</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-brand-gray mb-2">Meta Ads Connection</h2>
                {!isConnected ? (
                    <div className="space-y-4">
                        <details className="bg-gray-50 p-3 rounded-md border">
                            <summary className="font-semibold cursor-pointer text-sm text-gray-700">How to get your Access Token</summary>
                            <div className="mt-2 text-xs text-gray-600 space-y-1">
                                <p>1. Go to the <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">Meta Graph API Explorer</a>.</p>
                                <p>2. In the top-right, select your Meta App.</p>
                                <p>3. Click "Get Token" and select "Get User Access Token".</p>
                                <p>4. Add the following permissions: `leads_retrieval`, `ads_management`, `pages_show_list`, `business_management`.</p>
                                <p>5. Generate the token, copy it, and paste it below. For long-term use, you should extend the token's expiration.</p>
                            </div>
                        </details>
                        <div>
                            <label htmlFor="meta-token" className="block text-sm font-medium text-gray-700">User Access Token</label>
                            <input
                                type="password"
                                id="meta-token"
                                value={accessTokenInput}
                                onChange={(e) => setAccessTokenInput(e.target.value)}
                                className="mt-1 block w-full md:w-2/3 rounded-md border-transparent shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm bg-brand-gray text-white placeholder-gray-300"
                                placeholder="Paste your token here"
                            />
                        </div>
                        <button
                            onClick={handleConnect}
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-gray-400"
                        >
                            {loading ? 'Connecting...' : 'Connect to Meta'}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <p className="text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">Connected as {userProfile?.name}</p>
                            <button onClick={disconnect} className="text-sm font-medium text-red-600 hover:text-red-800">Disconnect</button>
                        </div>

                        {/* Page Selection */}
                        <div>
                            <label htmlFor="page-select" className="block text-sm font-medium text-gray-700">Select a Facebook Page</label>
                            <select
                                id="page-select"
                                value={selectedPageId || ''}
                                onChange={(e) => selectPage(e.target.value)}
                                disabled={loading || pages.length === 0}
                                className="mt-1 block w-full md:w-1/2 rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm disabled:bg-gray-200"
                            >
                                <option value="" disabled>{loading ? 'Loading pages...' : 'Select a page'}</option>
                                {pages.map(page => <option key={page.id} value={page.id}>{page.name}</option>)}
                            </select>
                        </div>

                        {/* Form Selection */}
                        {selectedPageId && (
                             <div>
                                <label htmlFor="form-select" className="block text-sm font-medium text-gray-700">Select a Lead Form</label>
                                <select
                                    id="form-select"
                                    value={selectedFormId || ''}
                                    onChange={(e) => saveFormSelection(e.target.value)}
                                    disabled={loading || forms.length === 0}
                                    className="mt-1 block w-full md:w-1/2 rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm disabled:bg-gray-200"
                                >
                                    <option value="" disabled>{loading ? 'Loading forms...' : 'Select a form'}</option>
                                    {forms.map(form => <option key={form.id} value={form.id}>{form.name}</option>)}
                                </select>
                            </div>
                        )}
                        
                        {/* Sync Button */}
                        <div className="border-t border-gray-200 pt-6">
                             <button
                                onClick={handleSyncLeads}
                                disabled={loading || !selectedFormId}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                            >
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                                {loading ? 'Syncing...' : 'Sync New Leads'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Integrations;