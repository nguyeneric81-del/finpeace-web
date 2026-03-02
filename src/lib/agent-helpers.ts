import { SupabaseClient } from '@supabase/supabase-js'

export interface ClientProfile {
    id: string;
    full_name: string;
    matched_by?: 'email' | 'name' | 'alias';
}

/**
 * Tra cứu client profile theo thứ tự ưu tiên:
 * 1. Email (chính xác)
 * 2. full_name (ilike)
 * 3. alias trong bảng client_aliases (ilike)
 */
export async function lookupClient(
    supabase: SupabaseClient,
    { email, client_name }: { email?: string; client_name?: string }
): Promise<{ profile: ClientProfile | null; error?: string }> {

    // 1. Lookup by email
    if (email) {
        const { data } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('email', email.trim())
            .single()
        if (data) return { profile: { ...data, matched_by: 'email' } };
    }

    if (!client_name?.trim()) {
        return { profile: null, error: 'Thiếu thông tin định danh khách hàng.' };
    }

    const term = client_name.trim();

    // 2. Lookup by full_name (ilike)
    const { data: byName } = await supabase
        .from('profiles')
        .select('id, full_name')
        .ilike('full_name', `%${term}%`)
        .limit(1)
    if (byName && byName.length > 0) {
        return { profile: { ...byName[0], matched_by: 'name' } };
    }

    // 3. Lookup by alias (ilike) → join về profiles
    const { data: byAlias } = await supabase
        .from('client_aliases')
        .select('user_id, profiles(id, full_name)')
        .ilike('alias', `%${term}%`)
        .limit(1)

    if (byAlias && byAlias.length > 0) {
        const profileData = (byAlias[0] as any).profiles;
        if (profileData) {
            return { profile: { ...profileData, matched_by: 'alias' } };
        }
    }

    return {
        profile: null,
        error: `Không tìm thấy khách hàng hoặc alias "${term}" trong hệ thống.`
    };
}
