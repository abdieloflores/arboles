SELECT  user_id
       ,sponsor
       ,placement
       ,name
FROM
(
	SELECT  *
	FROM users
	ORDER BY sponsor, user_id
) products_sorted, (
SELECT  @pv := 0) initialisation
WHERE find_in_set(sponsor, @pv)
AND length(@pv := concat(@pv, ',', user_id));