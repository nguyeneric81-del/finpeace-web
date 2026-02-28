const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
(async () => {
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  const user = users.users.find(u => u.email === 'yenle@finpeace.vn');
  
  if (user) {
    console.log("User found, updating password...");
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, { password: '123456', email_confirm: true });
    console.log("Update result:", error || "Success");
  } else {
    console.log("User not found in Auth, creating...");
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'yenle@finpeace.vn',
      password: '123456',
      email_confirm: true
    });
    console.log("Create result:", error || "Success");
  }
})();
