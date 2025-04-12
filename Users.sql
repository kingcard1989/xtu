CREATE TABLE users (
    stu_id VARCHAR2(20) PRIMARY KEY,
    username VARCHAR2(50),
    email VARCHAR2(100) UNIQUE NOT NULL,
    password VARCHAR2(255) NOT NULL,
    avater VARCHAR2(255),
    intro VARCHAR2(500),
    test_id VARCHAR2(50)
);