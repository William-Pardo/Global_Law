import type { MetaUserProfile, MetaPage, MetaForm, MetaLead, MetaLeadFieldData } from '../types';

const API_VERSION = 'v20.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

const handleApiResponse = async (response: Response) => {
    const json = await response.json();
    if (!response.ok) {
        const error = json.error ? new Error(json.error.message) : new Error('API request failed');
        console.error('Meta API Error:', json.error);
        throw error;
    }
    return json;
};

export const metaApiService = {
    validateToken: async (token: string): Promise<MetaUserProfile> => {
        const response = await fetch(`${BASE_URL}/me?access_token=${token}`);
        return handleApiResponse(response);
    },

    getPages: async (userAccessToken: string): Promise<MetaPage[]> => {
        const response = await fetch(`${BASE_URL}/me/accounts?fields=id,name,access_token&access_token=${userAccessToken}`);
        const data = await handleApiResponse(response);
        return data.data || [];
    },

    getForms: async (pageId: string, pageAccessToken: string): Promise<MetaForm[]> => {
        const response = await fetch(`${BASE_URL}/${pageId}/leadgen_forms?access_token=${pageAccessToken}`);
        const data = await handleApiResponse(response);
        return data.data || [];
    },

    getLeads: async (formId: string, pageAccessToken: string): Promise<MetaLead[]> => {
        const response = await fetch(`${BASE_URL}/${formId}/leads?fields=id,created_time,field_data&access_token=${pageAccessToken}`);
        const data = await handleApiResponse(response);
        return data.data || [];
    },

    // Helper to extract specific fields from lead data
    extractLeadInfo: (lead: MetaLead): { name: string, email: string, phone: string, leadId: string } => {
        const getFieldValue = (fieldName: string): string => {
            const field = lead.field_data.find(f => f.name.toLowerCase().includes(fieldName.toLowerCase()));
            return field ? field.values[0] : '';
        };

        let name = getFieldValue('full_name');
        // Fallback if full_name is not available
        if (!name) {
            const firstName = getFieldValue('first_name');
            const lastName = getFieldValue('last_name');
            name = [firstName, lastName].filter(Boolean).join(' ');
        }

        return {
            leadId: lead.id,
            name: name || 'N/A',
            email: getFieldValue('email') || `no-email-${lead.id}@example.com`,
            phone: getFieldValue('phone') || 'N/A',
        };
    }
};
