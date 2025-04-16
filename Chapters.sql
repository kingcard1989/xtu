CREATE TABLE chapters (
    id NUMBER PRIMARY KEY,
    title VARCHAR2(255),
    state NUMBER,
    course_id NUMBER,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);