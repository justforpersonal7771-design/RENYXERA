-- Forge: use the same subject names as the past papers (3 Nov 2026), so filters and analytics do not split one subject in two.
-- The batch files in data/forge/CS/batches were already updated to match. Run once in the Supabase SQL editor; safe to run twice.

update public.forge_items set subject = 'Computer Networks (CN)', updated_at = now() where id in ('FORGE_CS_000013', 'FORGE_CS_000023', 'FORGE_CS_000031', 'FORGE_CS_000043', 'FORGE_CS_000059');
update public.forge_items set subject = 'Computer Organization and Architecture (COA)', updated_at = now() where id in ('FORGE_CS_000014', 'FORGE_CS_000020', 'FORGE_CS_000021', 'FORGE_CS_000037', 'FORGE_CS_000048', 'FORGE_CS_000053', 'FORGE_CS_000060');
update public.forge_items set subject = 'Data Structures', updated_at = now() where id in ('FORGE_CS_000029');
update public.forge_items set subject = 'Database Management Systems (DBMS)', updated_at = now() where id in ('FORGE_CS_000010', 'FORGE_CS_000022', 'FORGE_CS_000030', 'FORGE_CS_000040', 'FORGE_CS_000044', 'FORGE_CS_000051', 'FORGE_CS_000058');
update public.forge_items set subject = 'Linear Algebra', updated_at = now() where id in ('FORGE_CS_000027');
update public.forge_items set subject = 'Operating Systems (OS)', updated_at = now() where id in ('FORGE_CS_000012', 'FORGE_CS_000018', 'FORGE_CS_000019', 'FORGE_CS_000032', 'FORGE_CS_000045', 'FORGE_CS_000057', 'FORGE_CS_000062');
update public.forge_items set subject = 'Probability & Statistics', updated_at = now() where id in ('FORGE_CS_000008', 'FORGE_CS_000041');
update public.forge_items set subject = 'Programming in C', updated_at = now() where id in ('FORGE_CS_000025');

select subject, count(*) from public.forge_items group by subject order by 2 desc;
