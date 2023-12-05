const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const authenticateAdmin = (req, res, next) => {
  const username = req.headers.username;
  const password = req.headers.password;

  if (ADMINS.some(admin => admin.username === username && admin.password === password)) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized user" });
  }
};

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  if (ADMINS.some(admin => admin.username === req.body.username)) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push({
      username: req.body.username,
      password: req.body.password
    });
    res.status(200).json({ message: 'Admin created successfully' });
  }
});

app.post('/admin/login', authenticateAdmin, (req, res) => {
  // logic to log in admin
  res.status(200).json({ message: "Login Successful" });
});

app.post('/admin/courses', authenticateAdmin, (req, res) => {
  // logic to create a course
  const courseId = Date.now();
  COURSES.push({
    courseId,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageLink: req.body.imageLink,
    published: req.body.published
  });
  res.status(200).json({ message: 'Course created successfully', courseId });
});

app.put('/admin/courses/:courseId', authenticateAdmin, (req, res) => {
  // logic to edit a course
  const courseIdx = COURSES.findIndex(course => course.courseId.toString() === req.params.courseId);
  if (courseIdx !== -1) {
    COURSES[courseIdx] = {
      ...COURSES[courseIdx],
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      imageLink: req.body.imageLink,
      published: req.body.published
    };
    res.status(200).json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authenticateAdmin, (req, res) => {
  // logic to get all courses
  res.status(200).json({ courses: COURSES });
});

const authenticateUser = (req, res, next) => {
  const username = req.headers.username;
  const password = req.headers.password;

  if (USERS.some(user => user.username === username && user.password === password)) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized user" });
  }
};

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  if (USERS.some(user => user.username === req.body.username)) {
    res.status(403).json({ message: "User already exists" });
  } else {
    USERS.push({
      username: req.body.username,
      password: req.body.password,
      courses: []
    });
    res.status(200).json({ message: 'User created successfully' });
  }
});

app.post('/users/login', authenticateUser, (req, res) => {
  // logic to log in user
  res.status(200).json({ message: "Login Successful" });
});

app.get('/users/courses', authenticateUser, (req, res) => {
  // logic to list all courses
  const publishedCourses = COURSES.filter(course => course.published === true);
  res.status(200).json({ courses: publishedCourses });
});

app.post('/users/courses/:courseId', authenticateUser, (req, res) => {
  // logic to purchase a course
  const courseId = Number(req.params.courseId);
  if (COURSES.some(course => course.courseId === courseId && course.published)) {
    const userIdx = USERS.findIndex(user => user.username === req.headers.username);
    USERS[userIdx].courses.push(req.params.courseId);
    USERS[userIdx].courses = [...new Set(USERS[userIdx].courses)];
    res.status(200).json({ message: 'Course purchased successfully' });
  } else {
    res.status(404).json({ message: 'Course not found or not available' });
  }
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  const userIdx = USERS.findIndex(user => user.username === req.headers.username);
  const userCourses = USERS[userIdx].courses.map(courseId => COURSES.find(course => course.courseId.toString() === courseId.toString()));
  res.status(200).json({ purchasedCourses: userCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
