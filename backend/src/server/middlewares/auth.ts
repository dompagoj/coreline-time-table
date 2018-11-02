export function registerUser() {
  return (req, res, next) => {
    req.ctx = {
      user: {
        id: 1,
        email: 'domziv@gmail.com',
      },
    }
    next()
  }
}
