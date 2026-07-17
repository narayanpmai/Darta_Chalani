const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const aiAgentService = {
  analyzeRegistration: async (documentText: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/AiAgent/analyze-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentText }),
      });
      if (!response.ok) throw new Error('Failed to analyze registration');
      return await response.json();
    } catch (error) {
      console.error('Error analyzing registration:', error);
      throw error;
    }
  },

  draftTippani: async (subject: string, contextDescription: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/AiAgent/draft-tippani`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, contextDescription }),
      });
      if (!response.ok) throw new Error('Failed to draft tippani');
      const data = await response.json();
      return data.draft;
    } catch (error) {
      console.error('Error drafting tippani:', error);
      throw error;
    }
  },

  draftSifaris: async (sifarisType: string, applicantName: string, submittedDocuments: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/AiAgent/draft-sifaris`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sifarisType, applicantName, submittedDocuments }),
      });
      if (!response.ok) throw new Error('Failed to draft sifaris');
      return await response.json();
    } catch (error) {
      console.error('Error drafting sifaris:', error);
      throw error;
    }
  },

  getAnalytics: async (rawDataContext: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/AiAgent/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rawDataContext }),
      });
      if (!response.ok) throw new Error('Failed to get analytics');
      const data = await response.json();
      return data.summary;
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  },

  draftMeetingMinutes: async (meetingTitle: string, agendas: string, discussionNotes: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/AiAgent/draft-meeting-minutes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meetingTitle, agendas, discussionNotes }),
      });
      if (!response.ok) throw new Error('Failed to draft meeting minutes');
      const data = await response.json();
      return data.draft;
    } catch (error) {
      console.error('Error drafting meeting minutes:', error);
      throw error;
    }
  }
};
