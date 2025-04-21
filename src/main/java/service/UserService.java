package service;

import model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;  // 或注入UserMapper

    public User createUser(User user) {
        return userRepository.save(user);  // 自动处理事务
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
