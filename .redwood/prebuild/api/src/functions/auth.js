import { DbAuthHandler } from '@redwoodjs/auth-dbauth-api';
import { cookieName } from "../lib/auth";
import { db } from "../lib/db";
export const handler = async (event, context) => {
  const forgotPasswordOptions = {
    // handler() is invoked after verifying that a user was found with the given
    // username. This is where you can send the user an email with a link to
    // reset their password. With the default dbAuth routes and field names, the
    // URL to reset the password will be:
    //
    // https://example.com/reset-password?resetToken=${user.resetToken}
    //
    // Whatever is returned from this function will be returned from
    // the `forgotPassword()` function that is destructured from `useAuth()`
    // You could use this return value to, for example, show the email
    // address in a toast message so the user will know it worked and where
    // to look for the email.
    handler: user => {
      return user;
    },
    // How long the resetToken is valid for, in seconds (default is 24 hours)
    expires: 60 * 60 * 24,
    errors: {
      // for security reasons you may want to be vague here rather than expose
      // the fact that the email address wasn't found (prevents fishing for
      // valid email addresses)
      usernameNotFound: 'Username not found',
      // if the user somehow gets around client validation
      usernameRequired: 'Username is required'
    }
  };
  const loginOptions = {
    // handler() is called after finding the user that matches the
    // username/password provided at login, but before actually considering them
    // logged in. The `user` argument will be the user in the database that
    // matched the username/password.
    //
    // If you want to allow this user to log in simply return the user.
    //
    // If you want to prevent someone logging in for another reason (maybe they
    // didn't validate their email yet), throw an error and it will be returned
    // by the `logIn()` function from `useAuth()` in the form of:
    // `{ message: 'Error message' }`
    handler: user => {
      return user;
    },
    errors: {
      usernameOrPasswordMissing: 'Both username and password are required',
      usernameNotFound: 'Username ${username} not found',
      // For security reasons you may want to make this the same as the
      // usernameNotFound error so that a malicious user can't use the error
      // to narrow down if it's the username or password that's incorrect
      incorrectPassword: 'Incorrect password for ${username}'
    },
    // How long a user will remain logged in, in seconds
    expires: 60 * 60 * 24 * 365 * 10
  };
  const resetPasswordOptions = {
    // handler() is invoked after the password has been successfully updated in
    // the database. Returning anything truthy will automatically log the user
    // in. Return `false` otherwise, and in the Reset Password page redirect the
    // user to the login page.
    handler: _user => {
      return true;
    },
    // If `false` then the new password MUST be different from the current one
    allowReusedPassword: true,
    errors: {
      // the resetToken is valid, but expired
      resetTokenExpired: 'resetToken is expired',
      // no user was found with the given resetToken
      resetTokenInvalid: 'resetToken is invalid',
      // the resetToken was not present in the URL
      resetTokenRequired: 'resetToken is required',
      // new password is the same as the old password (apparently they did not forget it)
      reusedPassword: 'Must choose a new password'
    }
  };
  const signupOptions = {
    // Whatever you want to happen to your data on new user signup. Redwood will
    // check for duplicate usernames before calling this handler. At a minimum
    // you need to save the `username`, `hashedPassword` and `salt` to your
    // user table. `userAttributes` contains any additional object members that
    // were included in the object given to the `signUp()` function you got
    // from `useAuth()`.
    //
    // If you want the user to be immediately logged in, return the user that
    // was created.
    //
    // If this handler throws an error, it will be returned by the `signUp()`
    // function in the form of: `{ error: 'Error message' }`.
    //
    // If this returns anything else, it will be returned by the
    // `signUp()` function in the form of: `{ message: 'String here' }`.
    handler: ({
      username,
      hashedPassword,
      salt,
      userAttributes
    }) => {
      return db.user.create({
        data: {
          email: username,
          hashedPassword: hashedPassword,
          salt: salt
          // name: userAttributes.name
        }
      });
    },
    // Include any format checks for password here. Return `true` if the
    // password is valid, otherwise throw a `PasswordValidationError`.
    // Import the error along with `DbAuthHandler` from `@redwoodjs/api` above.
    passwordValidation: _password => {
      return true;
    },
    errors: {
      // `field` will be either "username" or "password"
      fieldMissing: '${field} is required',
      usernameTaken: 'Username `${username}` already in use'
    }
  };
  const authHandler = new DbAuthHandler(event, context, {
    // Provide prisma db client
    db: db,
    // The name of the property you'd call on `db` to access your user table.
    // i.e. if your Prisma model is named `User` this value would be `user`, as in `db.user`
    authModelAccessor: 'user',
    // A map of what dbAuth calls a field to what your database calls it.
    // `id` is whatever column you use to uniquely identify a user (probably
    // something like `id` or `userId` or even `email`)
    authFields: {
      id: 'id',
      username: 'email',
      hashedPassword: 'hashedPassword',
      salt: 'salt',
      resetToken: 'resetToken',
      resetTokenExpiresAt: 'resetTokenExpiresAt'
    },
    // Specifies attributes on the cookie that dbAuth sets in order to remember
    // who is logged in. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies
    cookie: {
      attributes: {
        HttpOnly: true,
        Path: '/',
        SameSite: 'Strict',
        Secure: process.env.NODE_ENV !== 'development'

        // If you need to allow other domains (besides the api side) access to
        // the dbAuth session cookie:
        // Domain: 'example.com',
      },
      name: cookieName
    },
    forgotPassword: forgotPasswordOptions,
    login: loginOptions,
    resetPassword: resetPasswordOptions,
    signup: signupOptions
  });
  return await authHandler.invoke();
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJEYkF1dGhIYW5kbGVyIiwiY29va2llTmFtZSIsImRiIiwiaGFuZGxlciIsImV2ZW50IiwiY29udGV4dCIsImZvcmdvdFBhc3N3b3JkT3B0aW9ucyIsInVzZXIiLCJleHBpcmVzIiwiZXJyb3JzIiwidXNlcm5hbWVOb3RGb3VuZCIsInVzZXJuYW1lUmVxdWlyZWQiLCJsb2dpbk9wdGlvbnMiLCJ1c2VybmFtZU9yUGFzc3dvcmRNaXNzaW5nIiwiaW5jb3JyZWN0UGFzc3dvcmQiLCJyZXNldFBhc3N3b3JkT3B0aW9ucyIsIl91c2VyIiwiYWxsb3dSZXVzZWRQYXNzd29yZCIsInJlc2V0VG9rZW5FeHBpcmVkIiwicmVzZXRUb2tlbkludmFsaWQiLCJyZXNldFRva2VuUmVxdWlyZWQiLCJyZXVzZWRQYXNzd29yZCIsInNpZ251cE9wdGlvbnMiLCJ1c2VybmFtZSIsImhhc2hlZFBhc3N3b3JkIiwic2FsdCIsInVzZXJBdHRyaWJ1dGVzIiwiY3JlYXRlIiwiZGF0YSIsImVtYWlsIiwicGFzc3dvcmRWYWxpZGF0aW9uIiwiX3Bhc3N3b3JkIiwiZmllbGRNaXNzaW5nIiwidXNlcm5hbWVUYWtlbiIsImF1dGhIYW5kbGVyIiwiYXV0aE1vZGVsQWNjZXNzb3IiLCJhdXRoRmllbGRzIiwiaWQiLCJyZXNldFRva2VuIiwicmVzZXRUb2tlbkV4cGlyZXNBdCIsImNvb2tpZSIsImF0dHJpYnV0ZXMiLCJIdHRwT25seSIsIlBhdGgiLCJTYW1lU2l0ZSIsIlNlY3VyZSIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsIm5hbWUiLCJmb3Jnb3RQYXNzd29yZCIsImxvZ2luIiwicmVzZXRQYXNzd29yZCIsInNpZ251cCIsImludm9rZSJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2FwaS9zcmMvZnVuY3Rpb25zL2F1dGgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBUElHYXRld2F5UHJveHlFdmVudCwgQ29udGV4dCB9IGZyb20gJ2F3cy1sYW1iZGEnXG5cbmltcG9ydCB7IERiQXV0aEhhbmRsZXIsIERiQXV0aEhhbmRsZXJPcHRpb25zIH0gZnJvbSAnQHJlZHdvb2Rqcy9hdXRoLWRiYXV0aC1hcGknXG5cbmltcG9ydCB7IGNvb2tpZU5hbWUgfSBmcm9tICdzcmMvbGliL2F1dGgnXG5pbXBvcnQgeyBkYiB9IGZyb20gJ3NyYy9saWIvZGInXG5cbmV4cG9ydCBjb25zdCBoYW5kbGVyID0gYXN5bmMgKFxuICBldmVudDogQVBJR2F0ZXdheVByb3h5RXZlbnQsXG4gIGNvbnRleHQ6IENvbnRleHRcbikgPT4ge1xuICBjb25zdCBmb3Jnb3RQYXNzd29yZE9wdGlvbnM6IERiQXV0aEhhbmRsZXJPcHRpb25zWydmb3Jnb3RQYXNzd29yZCddID0ge1xuICAgIC8vIGhhbmRsZXIoKSBpcyBpbnZva2VkIGFmdGVyIHZlcmlmeWluZyB0aGF0IGEgdXNlciB3YXMgZm91bmQgd2l0aCB0aGUgZ2l2ZW5cbiAgICAvLyB1c2VybmFtZS4gVGhpcyBpcyB3aGVyZSB5b3UgY2FuIHNlbmQgdGhlIHVzZXIgYW4gZW1haWwgd2l0aCBhIGxpbmsgdG9cbiAgICAvLyByZXNldCB0aGVpciBwYXNzd29yZC4gV2l0aCB0aGUgZGVmYXVsdCBkYkF1dGggcm91dGVzIGFuZCBmaWVsZCBuYW1lcywgdGhlXG4gICAgLy8gVVJMIHRvIHJlc2V0IHRoZSBwYXNzd29yZCB3aWxsIGJlOlxuICAgIC8vXG4gICAgLy8gaHR0cHM6Ly9leGFtcGxlLmNvbS9yZXNldC1wYXNzd29yZD9yZXNldFRva2VuPSR7dXNlci5yZXNldFRva2VufVxuICAgIC8vXG4gICAgLy8gV2hhdGV2ZXIgaXMgcmV0dXJuZWQgZnJvbSB0aGlzIGZ1bmN0aW9uIHdpbGwgYmUgcmV0dXJuZWQgZnJvbVxuICAgIC8vIHRoZSBgZm9yZ290UGFzc3dvcmQoKWAgZnVuY3Rpb24gdGhhdCBpcyBkZXN0cnVjdHVyZWQgZnJvbSBgdXNlQXV0aCgpYFxuICAgIC8vIFlvdSBjb3VsZCB1c2UgdGhpcyByZXR1cm4gdmFsdWUgdG8sIGZvciBleGFtcGxlLCBzaG93IHRoZSBlbWFpbFxuICAgIC8vIGFkZHJlc3MgaW4gYSB0b2FzdCBtZXNzYWdlIHNvIHRoZSB1c2VyIHdpbGwga25vdyBpdCB3b3JrZWQgYW5kIHdoZXJlXG4gICAgLy8gdG8gbG9vayBmb3IgdGhlIGVtYWlsLlxuICAgIGhhbmRsZXI6ICh1c2VyKSA9PiB7XG4gICAgICByZXR1cm4gdXNlclxuICAgIH0sXG5cbiAgICAvLyBIb3cgbG9uZyB0aGUgcmVzZXRUb2tlbiBpcyB2YWxpZCBmb3IsIGluIHNlY29uZHMgKGRlZmF1bHQgaXMgMjQgaG91cnMpXG4gICAgZXhwaXJlczogNjAgKiA2MCAqIDI0LFxuXG4gICAgZXJyb3JzOiB7XG4gICAgICAvLyBmb3Igc2VjdXJpdHkgcmVhc29ucyB5b3UgbWF5IHdhbnQgdG8gYmUgdmFndWUgaGVyZSByYXRoZXIgdGhhbiBleHBvc2VcbiAgICAgIC8vIHRoZSBmYWN0IHRoYXQgdGhlIGVtYWlsIGFkZHJlc3Mgd2Fzbid0IGZvdW5kIChwcmV2ZW50cyBmaXNoaW5nIGZvclxuICAgICAgLy8gdmFsaWQgZW1haWwgYWRkcmVzc2VzKVxuICAgICAgdXNlcm5hbWVOb3RGb3VuZDogJ1VzZXJuYW1lIG5vdCBmb3VuZCcsXG4gICAgICAvLyBpZiB0aGUgdXNlciBzb21laG93IGdldHMgYXJvdW5kIGNsaWVudCB2YWxpZGF0aW9uXG4gICAgICB1c2VybmFtZVJlcXVpcmVkOiAnVXNlcm5hbWUgaXMgcmVxdWlyZWQnLFxuICAgIH0sXG4gIH1cblxuICBjb25zdCBsb2dpbk9wdGlvbnM6IERiQXV0aEhhbmRsZXJPcHRpb25zWydsb2dpbiddID0ge1xuICAgIC8vIGhhbmRsZXIoKSBpcyBjYWxsZWQgYWZ0ZXIgZmluZGluZyB0aGUgdXNlciB0aGF0IG1hdGNoZXMgdGhlXG4gICAgLy8gdXNlcm5hbWUvcGFzc3dvcmQgcHJvdmlkZWQgYXQgbG9naW4sIGJ1dCBiZWZvcmUgYWN0dWFsbHkgY29uc2lkZXJpbmcgdGhlbVxuICAgIC8vIGxvZ2dlZCBpbi4gVGhlIGB1c2VyYCBhcmd1bWVudCB3aWxsIGJlIHRoZSB1c2VyIGluIHRoZSBkYXRhYmFzZSB0aGF0XG4gICAgLy8gbWF0Y2hlZCB0aGUgdXNlcm5hbWUvcGFzc3dvcmQuXG4gICAgLy9cbiAgICAvLyBJZiB5b3Ugd2FudCB0byBhbGxvdyB0aGlzIHVzZXIgdG8gbG9nIGluIHNpbXBseSByZXR1cm4gdGhlIHVzZXIuXG4gICAgLy9cbiAgICAvLyBJZiB5b3Ugd2FudCB0byBwcmV2ZW50IHNvbWVvbmUgbG9nZ2luZyBpbiBmb3IgYW5vdGhlciByZWFzb24gKG1heWJlIHRoZXlcbiAgICAvLyBkaWRuJ3QgdmFsaWRhdGUgdGhlaXIgZW1haWwgeWV0KSwgdGhyb3cgYW4gZXJyb3IgYW5kIGl0IHdpbGwgYmUgcmV0dXJuZWRcbiAgICAvLyBieSB0aGUgYGxvZ0luKClgIGZ1bmN0aW9uIGZyb20gYHVzZUF1dGgoKWAgaW4gdGhlIGZvcm0gb2Y6XG4gICAgLy8gYHsgbWVzc2FnZTogJ0Vycm9yIG1lc3NhZ2UnIH1gXG4gICAgaGFuZGxlcjogKHVzZXIpID0+IHtcbiAgICAgIHJldHVybiB1c2VyXG4gICAgfSxcblxuICAgIGVycm9yczoge1xuICAgICAgdXNlcm5hbWVPclBhc3N3b3JkTWlzc2luZzogJ0JvdGggdXNlcm5hbWUgYW5kIHBhc3N3b3JkIGFyZSByZXF1aXJlZCcsXG4gICAgICB1c2VybmFtZU5vdEZvdW5kOiAnVXNlcm5hbWUgJHt1c2VybmFtZX0gbm90IGZvdW5kJyxcbiAgICAgIC8vIEZvciBzZWN1cml0eSByZWFzb25zIHlvdSBtYXkgd2FudCB0byBtYWtlIHRoaXMgdGhlIHNhbWUgYXMgdGhlXG4gICAgICAvLyB1c2VybmFtZU5vdEZvdW5kIGVycm9yIHNvIHRoYXQgYSBtYWxpY2lvdXMgdXNlciBjYW4ndCB1c2UgdGhlIGVycm9yXG4gICAgICAvLyB0byBuYXJyb3cgZG93biBpZiBpdCdzIHRoZSB1c2VybmFtZSBvciBwYXNzd29yZCB0aGF0J3MgaW5jb3JyZWN0XG4gICAgICBpbmNvcnJlY3RQYXNzd29yZDogJ0luY29ycmVjdCBwYXNzd29yZCBmb3IgJHt1c2VybmFtZX0nLFxuICAgIH0sXG5cbiAgICAvLyBIb3cgbG9uZyBhIHVzZXIgd2lsbCByZW1haW4gbG9nZ2VkIGluLCBpbiBzZWNvbmRzXG4gICAgZXhwaXJlczogNjAgKiA2MCAqIDI0ICogMzY1ICogMTAsXG4gIH1cblxuICBjb25zdCByZXNldFBhc3N3b3JkT3B0aW9uczogRGJBdXRoSGFuZGxlck9wdGlvbnNbJ3Jlc2V0UGFzc3dvcmQnXSA9IHtcbiAgICAvLyBoYW5kbGVyKCkgaXMgaW52b2tlZCBhZnRlciB0aGUgcGFzc3dvcmQgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IHVwZGF0ZWQgaW5cbiAgICAvLyB0aGUgZGF0YWJhc2UuIFJldHVybmluZyBhbnl0aGluZyB0cnV0aHkgd2lsbCBhdXRvbWF0aWNhbGx5IGxvZyB0aGUgdXNlclxuICAgIC8vIGluLiBSZXR1cm4gYGZhbHNlYCBvdGhlcndpc2UsIGFuZCBpbiB0aGUgUmVzZXQgUGFzc3dvcmQgcGFnZSByZWRpcmVjdCB0aGVcbiAgICAvLyB1c2VyIHRvIHRoZSBsb2dpbiBwYWdlLlxuICAgIGhhbmRsZXI6IChfdXNlcikgPT4ge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9LFxuXG4gICAgLy8gSWYgYGZhbHNlYCB0aGVuIHRoZSBuZXcgcGFzc3dvcmQgTVVTVCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgY3VycmVudCBvbmVcbiAgICBhbGxvd1JldXNlZFBhc3N3b3JkOiB0cnVlLFxuXG4gICAgZXJyb3JzOiB7XG4gICAgICAvLyB0aGUgcmVzZXRUb2tlbiBpcyB2YWxpZCwgYnV0IGV4cGlyZWRcbiAgICAgIHJlc2V0VG9rZW5FeHBpcmVkOiAncmVzZXRUb2tlbiBpcyBleHBpcmVkJyxcbiAgICAgIC8vIG5vIHVzZXIgd2FzIGZvdW5kIHdpdGggdGhlIGdpdmVuIHJlc2V0VG9rZW5cbiAgICAgIHJlc2V0VG9rZW5JbnZhbGlkOiAncmVzZXRUb2tlbiBpcyBpbnZhbGlkJyxcbiAgICAgIC8vIHRoZSByZXNldFRva2VuIHdhcyBub3QgcHJlc2VudCBpbiB0aGUgVVJMXG4gICAgICByZXNldFRva2VuUmVxdWlyZWQ6ICdyZXNldFRva2VuIGlzIHJlcXVpcmVkJyxcbiAgICAgIC8vIG5ldyBwYXNzd29yZCBpcyB0aGUgc2FtZSBhcyB0aGUgb2xkIHBhc3N3b3JkIChhcHBhcmVudGx5IHRoZXkgZGlkIG5vdCBmb3JnZXQgaXQpXG4gICAgICByZXVzZWRQYXNzd29yZDogJ011c3QgY2hvb3NlIGEgbmV3IHBhc3N3b3JkJyxcbiAgICB9LFxuICB9XG5cbiAgY29uc3Qgc2lnbnVwT3B0aW9uczogRGJBdXRoSGFuZGxlck9wdGlvbnNbJ3NpZ251cCddID0ge1xuICAgIC8vIFdoYXRldmVyIHlvdSB3YW50IHRvIGhhcHBlbiB0byB5b3VyIGRhdGEgb24gbmV3IHVzZXIgc2lnbnVwLiBSZWR3b29kIHdpbGxcbiAgICAvLyBjaGVjayBmb3IgZHVwbGljYXRlIHVzZXJuYW1lcyBiZWZvcmUgY2FsbGluZyB0aGlzIGhhbmRsZXIuIEF0IGEgbWluaW11bVxuICAgIC8vIHlvdSBuZWVkIHRvIHNhdmUgdGhlIGB1c2VybmFtZWAsIGBoYXNoZWRQYXNzd29yZGAgYW5kIGBzYWx0YCB0byB5b3VyXG4gICAgLy8gdXNlciB0YWJsZS4gYHVzZXJBdHRyaWJ1dGVzYCBjb250YWlucyBhbnkgYWRkaXRpb25hbCBvYmplY3QgbWVtYmVycyB0aGF0XG4gICAgLy8gd2VyZSBpbmNsdWRlZCBpbiB0aGUgb2JqZWN0IGdpdmVuIHRvIHRoZSBgc2lnblVwKClgIGZ1bmN0aW9uIHlvdSBnb3RcbiAgICAvLyBmcm9tIGB1c2VBdXRoKClgLlxuICAgIC8vXG4gICAgLy8gSWYgeW91IHdhbnQgdGhlIHVzZXIgdG8gYmUgaW1tZWRpYXRlbHkgbG9nZ2VkIGluLCByZXR1cm4gdGhlIHVzZXIgdGhhdFxuICAgIC8vIHdhcyBjcmVhdGVkLlxuICAgIC8vXG4gICAgLy8gSWYgdGhpcyBoYW5kbGVyIHRocm93cyBhbiBlcnJvciwgaXQgd2lsbCBiZSByZXR1cm5lZCBieSB0aGUgYHNpZ25VcCgpYFxuICAgIC8vIGZ1bmN0aW9uIGluIHRoZSBmb3JtIG9mOiBgeyBlcnJvcjogJ0Vycm9yIG1lc3NhZ2UnIH1gLlxuICAgIC8vXG4gICAgLy8gSWYgdGhpcyByZXR1cm5zIGFueXRoaW5nIGVsc2UsIGl0IHdpbGwgYmUgcmV0dXJuZWQgYnkgdGhlXG4gICAgLy8gYHNpZ25VcCgpYCBmdW5jdGlvbiBpbiB0aGUgZm9ybSBvZjogYHsgbWVzc2FnZTogJ1N0cmluZyBoZXJlJyB9YC5cbiAgICBoYW5kbGVyOiAoeyB1c2VybmFtZSwgaGFzaGVkUGFzc3dvcmQsIHNhbHQsIHVzZXJBdHRyaWJ1dGVzIH0pID0+IHtcbiAgICAgIHJldHVybiBkYi51c2VyLmNyZWF0ZSh7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBlbWFpbDogdXNlcm5hbWUsXG4gICAgICAgICAgaGFzaGVkUGFzc3dvcmQ6IGhhc2hlZFBhc3N3b3JkLFxuICAgICAgICAgIHNhbHQ6IHNhbHQsXG4gICAgICAgICAgLy8gbmFtZTogdXNlckF0dHJpYnV0ZXMubmFtZVxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgLy8gSW5jbHVkZSBhbnkgZm9ybWF0IGNoZWNrcyBmb3IgcGFzc3dvcmQgaGVyZS4gUmV0dXJuIGB0cnVlYCBpZiB0aGVcbiAgICAvLyBwYXNzd29yZCBpcyB2YWxpZCwgb3RoZXJ3aXNlIHRocm93IGEgYFBhc3N3b3JkVmFsaWRhdGlvbkVycm9yYC5cbiAgICAvLyBJbXBvcnQgdGhlIGVycm9yIGFsb25nIHdpdGggYERiQXV0aEhhbmRsZXJgIGZyb20gYEByZWR3b29kanMvYXBpYCBhYm92ZS5cbiAgICBwYXNzd29yZFZhbGlkYXRpb246IChfcGFzc3dvcmQpID0+IHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSxcblxuICAgIGVycm9yczoge1xuICAgICAgLy8gYGZpZWxkYCB3aWxsIGJlIGVpdGhlciBcInVzZXJuYW1lXCIgb3IgXCJwYXNzd29yZFwiXG4gICAgICBmaWVsZE1pc3Npbmc6ICcke2ZpZWxkfSBpcyByZXF1aXJlZCcsXG4gICAgICB1c2VybmFtZVRha2VuOiAnVXNlcm5hbWUgYCR7dXNlcm5hbWV9YCBhbHJlYWR5IGluIHVzZScsXG4gICAgfSxcbiAgfVxuXG4gIGNvbnN0IGF1dGhIYW5kbGVyID0gbmV3IERiQXV0aEhhbmRsZXIoZXZlbnQsIGNvbnRleHQsIHtcbiAgICAvLyBQcm92aWRlIHByaXNtYSBkYiBjbGllbnRcbiAgICBkYjogZGIsXG5cbiAgICAvLyBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgeW91J2QgY2FsbCBvbiBgZGJgIHRvIGFjY2VzcyB5b3VyIHVzZXIgdGFibGUuXG4gICAgLy8gaS5lLiBpZiB5b3VyIFByaXNtYSBtb2RlbCBpcyBuYW1lZCBgVXNlcmAgdGhpcyB2YWx1ZSB3b3VsZCBiZSBgdXNlcmAsIGFzIGluIGBkYi51c2VyYFxuICAgIGF1dGhNb2RlbEFjY2Vzc29yOiAndXNlcicsXG5cbiAgICAvLyBBIG1hcCBvZiB3aGF0IGRiQXV0aCBjYWxscyBhIGZpZWxkIHRvIHdoYXQgeW91ciBkYXRhYmFzZSBjYWxscyBpdC5cbiAgICAvLyBgaWRgIGlzIHdoYXRldmVyIGNvbHVtbiB5b3UgdXNlIHRvIHVuaXF1ZWx5IGlkZW50aWZ5IGEgdXNlciAocHJvYmFibHlcbiAgICAvLyBzb21ldGhpbmcgbGlrZSBgaWRgIG9yIGB1c2VySWRgIG9yIGV2ZW4gYGVtYWlsYClcbiAgICBhdXRoRmllbGRzOiB7XG4gICAgICBpZDogJ2lkJyxcbiAgICAgIHVzZXJuYW1lOiAnZW1haWwnLFxuICAgICAgaGFzaGVkUGFzc3dvcmQ6ICdoYXNoZWRQYXNzd29yZCcsXG4gICAgICBzYWx0OiAnc2FsdCcsXG4gICAgICByZXNldFRva2VuOiAncmVzZXRUb2tlbicsXG4gICAgICByZXNldFRva2VuRXhwaXJlc0F0OiAncmVzZXRUb2tlbkV4cGlyZXNBdCcsXG4gICAgfSxcblxuICAgIC8vIFNwZWNpZmllcyBhdHRyaWJ1dGVzIG9uIHRoZSBjb29raWUgdGhhdCBkYkF1dGggc2V0cyBpbiBvcmRlciB0byByZW1lbWJlclxuICAgIC8vIHdobyBpcyBsb2dnZWQgaW4uIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVFRQL0Nvb2tpZXMjcmVzdHJpY3RfYWNjZXNzX3RvX2Nvb2tpZXNcbiAgICBjb29raWU6IHtcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgSHR0cE9ubHk6IHRydWUsXG4gICAgICAgIFBhdGg6ICcvJyxcbiAgICAgICAgU2FtZVNpdGU6ICdTdHJpY3QnLFxuICAgICAgICBTZWN1cmU6IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAnZGV2ZWxvcG1lbnQnLFxuXG4gICAgICAgIC8vIElmIHlvdSBuZWVkIHRvIGFsbG93IG90aGVyIGRvbWFpbnMgKGJlc2lkZXMgdGhlIGFwaSBzaWRlKSBhY2Nlc3MgdG9cbiAgICAgICAgLy8gdGhlIGRiQXV0aCBzZXNzaW9uIGNvb2tpZTpcbiAgICAgICAgLy8gRG9tYWluOiAnZXhhbXBsZS5jb20nLFxuICAgICAgfSxcbiAgICAgIG5hbWU6IGNvb2tpZU5hbWUsXG4gICAgfSxcblxuICAgIGZvcmdvdFBhc3N3b3JkOiBmb3Jnb3RQYXNzd29yZE9wdGlvbnMsXG4gICAgbG9naW46IGxvZ2luT3B0aW9ucyxcbiAgICByZXNldFBhc3N3b3JkOiByZXNldFBhc3N3b3JkT3B0aW9ucyxcbiAgICBzaWdudXA6IHNpZ251cE9wdGlvbnMsXG4gIH0pXG5cbiAgcmV0dXJuIGF3YWl0IGF1dGhIYW5kbGVyLmludm9rZSgpXG59XG4iXSwibWFwcGluZ3MiOiJBQUVBLFNBQVNBLGFBQWEsUUFBOEIsNEJBQTRCO0FBRWhGLFNBQVNDLFVBQVU7QUFDbkIsU0FBU0MsRUFBRTtBQUVYLE9BQU8sTUFBTUMsT0FBTyxHQUFHLE1BQUFBLENBQ3JCQyxLQUEyQixFQUMzQkMsT0FBZ0IsS0FDYjtFQUNILE1BQU1DLHFCQUE2RCxHQUFHO0lBQ3BF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