package model;


import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    @Column(unique = true)  // 邮箱唯一
    private String email;
    private String password;
    private String avatar;   // 头像URL
    private String intro;    // 简介
    private Long testId;     // 测试ID（若需关联其他表）
}