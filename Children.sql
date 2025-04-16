CREATE TABLE children (
    id NUMBER PRIMARY KEY,
    title VARCHAR2(255),
    videosource_id VARCHAR2(255),
    chapter_id NUMBER,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);