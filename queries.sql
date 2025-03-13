SELECT * FROM groups;

SELECT * FROM groups_users_links;

INSERT INTO groups_users_links (group_id, user_id) 
	VALUES (1, 1);

UPDATE groups_users_links
	SET group_id = 2
	WHERE id = 2;

SELECT * FROM permissions;

SELECT * FROM permissions_users_links;

SELECT * FROM permissions_service_links;

SELECT permissions_users_links.permission_id as id,
permissions_users_links.user_id,
permissions.name, 
permissions.description,
services.name as service
FROM permissions_users_links
LEFT JOIN permissions ON permissions.id = permissions_users_links.permission_id
LEFT JOIN permissions_service_links ON permissions_service_links.permission_id = permissions.id
LEFT JOIN services ON services.id = permissions_service_links.service_id
WHERE user_id = 1;
