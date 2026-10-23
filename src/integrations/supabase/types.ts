// Softgen scaffold, reconciled against the applied private-draft schema.
// Only marketplace drafts are modeled; no schema is inferred for profiles.
/* eslint-disable @typescript-eslint/no-empty-object-type */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      marketplace_listing_drafts: {
        Row: {
          id: string;
          owner_id: string;
          display_alias: string;
          city: string;
          description: string;
          photo_rights_attested: boolean;
          state: 'draft' | 'submitted' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        // Matches the authenticated column grants, not administrative writes.
        Insert: {
          owner_id: string;
          display_alias: string;
          city: string;
          description?: string;
          photo_rights_attested?: boolean;
        };
        Update: {
          display_alias?: string;
          city?: string;
          description?: string;
          photo_rights_attested?: boolean;
        };
        Relationships: [];
      };
    }
    Views: {
      // Add your views here
    }
    Functions: {
      // Add your functions here
    }
    Enums: {
      // Add your enums here
    }
    CompositeTypes: {
      // Add your composite types here
    }
  }
}

// Softgen project ID: 4d3af0ab-bad5-4906-84f5-bdd09bdb40d6
// This is not a Supabase database project reference.
