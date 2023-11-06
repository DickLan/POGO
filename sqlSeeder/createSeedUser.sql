-- CREATE USER 'admin'@'localhost' IDENTIFIED BY 'StrongPassword123@';
-- GRANT ALL PRIVILEGES ON pogo.* TO 'admin'@'localhost';

-- 賦予讀寫特定資料庫的權限
-- CREATE USER 'testuser'@'localhost' IDENTIFIED BY 'testtest';
GRANT ALL PRIVILEGES ON pogo.* TO 'testuser'@'localhost';
-- 如果需要創建、刪除表或管理索引等
-- CREATE USER 'pogouser'@'localhost' IDENTIFIED BY 'pogopogo';
-- GRANT ALL PRIVILEGES ON pogo.*  TO 'pogouser'@'localhost';
GRANT CREATE, select,DROP, INDEX, ALTER ON pogo.* TO 'pogouser'@'localhost';
FLUSH PRIVILEGES;
