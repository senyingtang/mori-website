## 後台角色緊急調整 SQL（僅限專案擁有者）

> 本文件**不包含密碼**，也不應公開。僅供 Supabase 專案擁有者於緊急情況下，在 Supabase Dashboard 的 SQL Editor 手動執行。

### 情境

若 `public.bootstrap_super_admin()` 因資料庫中已存在 `super_admin` 而失敗，但仍需要將特定帳號（例如第一個管理員）升級為 `super_admin`，可使用以下 SQL。

### 升級指定 email 為 super_admin

```sql
update public.profiles
set role = 'super_admin',
    updated_at = now()
where id = (
  select id
  from auth.users
  where lower(email) = lower('senyingtang2025@gmail.com')
  limit 1
);
```

### 注意事項

- 僅限 **Supabase 專案擁有者**在 Dashboard SQL Editor 執行。
- 不要把任何密碼寫入 SQL、文件或 `.env`。
- 執行後請登出再登入，讓前端取得最新 role。

