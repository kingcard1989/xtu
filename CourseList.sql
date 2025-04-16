CREATE TABLE course_list (
    id NUMBER PRIMARY KEY,
    course_id NUMBER,
    title VARCHAR2(255),
    description VARCHAR2(500),
    cover VARCHAR2(255),
    lesson_num NUMBER,
    credit NUMBER,
    limit_count NUMBER,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);