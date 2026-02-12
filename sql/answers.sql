
use creator_dashboard;

/*
assumptions

- active subscription means status = 'active'
- revenue is sum of active plan_price
- for revenue per 1000 views if views are 0 i am excluding them
  to avoid divide by zero

*/



/* 
q1 — posts per creator

what i am doing:
- joining creators with posts using left join so that
  even creators with no posts will still appear
- counting p.id to get total posts per creator
- grouping by creator id
- sorting by total posts desc to see highest first

*/

select  c.name as creator_name,
count(p.id) as total_posts
from creators as c
left join posts as p
on c.id = p.creator_id
group by c.id
order by total_posts desc;



/*
q2 — current active revenue per creator

what i am doing:
- left joining subscriptions
- filtering only active subscriptions
- summing plan_price to get revenue
- coalesce used so if null then it becomes 0

*/

select c.name as creator_name,
coalesce(sum(s.plan_price), 0) as current_revenue
from creators as c
left join subscriptions as s
on c.id = s.creator_id
where s.status="active"
group by c.id
order by current_revenue desc;



/* 
q3 — jan 2025 cohort conversion

what i am doing:
- filtering creators who signed up in jan 2025
- counting distinct creator ids so duplicates dont happen
- using case inside count distinct to count only those
  who have active subscriptions
- conversion rate is active / signed if signed = 0,I am mentioning it as 0

 */

select c.signup_date,
count(distinct c.id) as creators_signed,
count(distinct case when s.status = 'active' then c.id end) as creators_with_active_subscription,
case when count(distinct c.id) = 0 then 0 else count(distinct case when s.status = 'active' then c.id end) * 1.0/ count(distinct c.id)
end as conversion_rate
from creators c
left join subscriptions s
on c.id = s.creator_id
where c.signup_date >= '2025-01-01'and c.signup_date < '2025-02-01'
group by c.signup_date
order by c.signup_date;



/*
q4 — revenue efficiency metric

what i am doing:
- first making ctes to calculate total revenue and total views
  separately per creator
- then joining those ctes with creators table
- using coalesce so null becomes 0
- if views = 0,we are recognizing revenue per 1000 views as 0 
- formula revenue * 1000 / views
- ordering desc and limiting 3 for top creators

 */

with rev as (select creator_id,
sum(plan_price) as revenue
from subscriptions
where status = 'active'
group by creator_id
),
views_cte as (select creator_id,
sum(views) as views
from posts
group by creator_id
)

select c.name as creator_name,
coalesce(r.revenue, 0) as revenue,
coalesce(v.views, 0) as views,
case when v.views = 0 or v.views is null then 0 else revenue * 1000.0 / v.views end
as revenue_per_1000_views
from creators c
left join rev r on c.id = r.creator_id
left join views_cte v on c.id = v.creator_id
order by revenue_per_1000_views desc
limit 3;


-- index on signup_date because in q3 we are filtering
create index idx_creators_signup_date
on creators(signup_date);

-- index on creator_id + status because of q2/q3/q4
-- frequently check active subscriptions per creator
create index idx_subscriptions_creator_status
on subscriptions(creator_id, status);

-- index on creator_id in posts because of q1 and q4
-- group by and joins happen on this
create index idx_posts_creator
on posts(creator_id);

