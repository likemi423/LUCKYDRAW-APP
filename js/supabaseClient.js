// === 请在这里粘贴你的 Supabase 项目 URL 和 anon_key ===
// ！！注意：如果直接上传到公开的 GitHub 仓库，你的 key 会被他人看到！！
// 如果需要在本机使用，可以在这里填写，并确保这个文件不要推送到公开仓库中（可以将其加入 .gitignore）。

const SUPABASE_URL = 'https://sfauzixrcrscsxpyglaj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmYXV6aXhyY3JzY3N4cHlnbGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MzA0MjQsImV4cCI6MjA4ODUwNjQyNH0.DMpfhk_wGBVX-CH2FUxl1u6bO-gy2uXKMmZx8eYlNo0';

// 初始化 Supabase (compatible with UMD build)
const _sb = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);
let supabaseClient = null;
if (_sb) {
    supabaseClient = _sb.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.warn('\u26a0\ufe0f Supabase 库未加载！');
}

const SupabaseAPI = {
    async login(email, password) {
        if (!supabaseClient) return null;
        return await supabaseClient.auth.signInWithPassword({ email, password });
    },

    async logout() {
        if (!supabaseClient) return null;
        return await supabaseClient.auth.signOut();
    },

    onAuthStateChange(callback) {
        if (!supabaseClient) return;
        supabaseClient.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    },

    async recordWinners(theme, prizeName, winners) {
        if (!supabaseClient || SUPABASE_URL === 'YOUR_SUPABASE_URL') {
            console.warn('\u26a0\ufe0f Supabase \u5c1a\u672a\u914d\u7f6e\u6216\u672a\u52a0\u8f7d\uff0c\u6682\u65f6\u53ea\u5728\u672c\u5730\u4fdd\u5b58\u4e2d\u5956\u8d44\u6599\u3002');
            return;
        }

        if (!winners) return;

        const dataToInsert = winners.map(w => ({
            theme: theme,
            prize_name: prizeName,
            winner_id: w.id,
            winner_name: w.name,
            drawn_at: w.timestamp
        }));

        try {
            const { data, error } = await supabaseClient
                .from('lucky_draw_winners')
                .insert(dataToInsert);

            if (error) {
                console.error('\u274c \u4e0a\u4f20\u4e2d\u5956\u6570\u636e\u5230 Supabase \u5931\u8d25:', error);
            } else {
                console.log('\u2705 \u6210\u529f\u5c06\u6700\u65b0\u4e2d\u5956\u6570\u636e\u4e0a\u4f20\u5230 Supabase:', dataToInsert);
            }
        } catch (err) {
            console.error('\u7f51\u7edc\u6216\u672a\u77e5\u9519\u8bef:', err);
        }
    }
};

// 挂载到全局
window.SupabaseAPI = SupabaseAPI;
