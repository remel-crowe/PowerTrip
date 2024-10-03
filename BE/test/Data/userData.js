const userData = {
  testUsers: [
    {
      name: "Test User 1",
      email: "testuser1@mail.com",
      password: "password123",
      garage: [
        {
          make: "Tesla",
          model: "Model S",
          maxMiles: 300,
          charge: 100,
          fastCharge: true,
        },
      ],
    },

    {
      name: "Test User 2",
      email: "testuser2@mail.com",
      password: "password123",
      garage: [],
    },
  ],

  newUser: {
    name: "New User",
    email: "newuser@mail.com",
    password: "password123",
    garage: [],
  },

  existingUser: {
    name: "Existing User",
    email: "testuser1@mail.com",
    password: "$2b$08$1CO3XEo/pNqtTPO/6x2ksOqTFf0YNNZptNgfSCyfIh6h2mdj0pG/W",
  },
};

export default userData;
