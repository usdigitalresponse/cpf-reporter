import _Array$isArray from "@babel/runtime-corejs3/core-js/array/is-array";
import _includesInstanceProperty from "@babel/runtime-corejs3/core-js/instance/includes";
import _someInstanceProperty from "@babel/runtime-corejs3/core-js/instance/some";
import { AuthenticationError, ForbiddenError, context } from '@redwoodjs/graphql-server';
import { db } from "./db";

/**
 * The name of the cookie that dbAuth sets
 *
 * %port% will be replaced with the port the api server is running on.
 * If you have multiple RW apps running on the same host, you'll need to
 * make sure they all use unique cookie names
 */
export const cookieName = 'session_%port%';

/**
 * The session object sent in as the first argument to getCurrentUser() will
 * have a single key `id` containing the unique ID of the logged in user
 * (whatever field you set as `authFields.id` in your auth function config).
 * You'll need to update the call to `db` below if you use a different model
 * name or unique field name, for example:
 *
 *   return await db.profile.findUnique({ where: { email: session.id } })
 *                   ───┬───                       ──┬──
 *      model accessor ─┘      unique id field name ─┘
 *
 * !! BEWARE !! Anything returned from this function will be available to the
 * client--it becomes the content of `currentUser` on the web side (as well as
 * `context.currentUser` on the api side). You should carefully add additional
 * fields to the `select` object below once you've decided they are safe to be
 * seen if someone were to open the Web Inspector in their browser.
 */
export const getCurrentUser = async session => {
  if (!session || typeof session.id !== 'number') {
    throw new Error('Invalid session');
  }
  return await db.user.findUnique({
    where: {
      id: session.id
    },
    select: {
      id: true
    }
  });
};

/**
 * The user is authenticated if there is a currentUser in the context
 *
 * @returns {boolean} - If the currentUser is authenticated
 */
export const isAuthenticated = () => {
  return !!context.currentUser;
};

/**
 * When checking role membership, roles can be a single value, a list, or none.
 * You can use Prisma enums too (if you're using them for roles), just import your enum type from `@prisma/client`
 */

/**
 * Checks if the currentUser is authenticated (and assigned one of the given roles)
 *
 * @param roles: {@link AllowedRoles} - Checks if the currentUser is assigned one of these roles
 *
 * @returns {boolean} - Returns true if the currentUser is logged in and assigned one of the given roles,
 * or when no roles are provided to check against. Otherwise returns false.
 */
export const hasRole = roles => {
  if (!isAuthenticated()) {
    return false;
  }
  const currentUserRoles = context.currentUser?.roles;
  if (typeof roles === 'string') {
    if (typeof currentUserRoles === 'string') {
      // roles to check is a string, currentUser.roles is a string
      return currentUserRoles === roles;
    } else if (_Array$isArray(currentUserRoles)) {
      // roles to check is a string, currentUser.roles is an array
      return currentUserRoles?.some(allowedRole => roles === allowedRole);
    }
  }
  if (_Array$isArray(roles)) {
    if (_Array$isArray(currentUserRoles)) {
      // roles to check is an array, currentUser.roles is an array
      return currentUserRoles?.some(allowedRole => _includesInstanceProperty(roles).call(roles, allowedRole));
    } else if (typeof currentUserRoles === 'string') {
      // roles to check is an array, currentUser.roles is a string
      return _someInstanceProperty(roles).call(roles, allowedRole => currentUserRoles === allowedRole);
    }
  }

  // roles not found
  return false;
};

/**
 * Use requireAuth in your services to check that a user is logged in,
 * whether or not they are assigned a role, and optionally raise an
 * error if they're not.
 *
 * @param roles: {@link AllowedRoles} - When checking role membership, these roles grant access.
 *
 * @returns - If the currentUser is authenticated (and assigned one of the given roles)
 *
 * @throws {@link AuthenticationError} - If the currentUser is not authenticated
 * @throws {@link ForbiddenError} If the currentUser is not allowed due to role permissions
 *
 * @see https://github.com/redwoodjs/redwood/tree/main/packages/auth for examples
 */
export const requireAuth = ({
  roles
} = {}) => {
  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.");
  }
  if (roles && !hasRole(roles)) {
    throw new ForbiddenError("You don't have access to do that.");
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJBdXRoZW50aWNhdGlvbkVycm9yIiwiRm9yYmlkZGVuRXJyb3IiLCJjb250ZXh0IiwiZGIiLCJjb29raWVOYW1lIiwiZ2V0Q3VycmVudFVzZXIiLCJzZXNzaW9uIiwiaWQiLCJFcnJvciIsInVzZXIiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJzZWxlY3QiLCJpc0F1dGhlbnRpY2F0ZWQiLCJjdXJyZW50VXNlciIsImhhc1JvbGUiLCJyb2xlcyIsImN1cnJlbnRVc2VyUm9sZXMiLCJfQXJyYXkkaXNBcnJheSIsInNvbWUiLCJhbGxvd2VkUm9sZSIsIl9pbmNsdWRlc0luc3RhbmNlUHJvcGVydHkiLCJjYWxsIiwiX3NvbWVJbnN0YW5jZVByb3BlcnR5IiwicmVxdWlyZUF1dGgiXSwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9hcGkvc3JjL2xpYi9hdXRoLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRGVjb2RlZCB9IGZyb20gJ0ByZWR3b29kanMvYXBpJ1xuaW1wb3J0IHsgQXV0aGVudGljYXRpb25FcnJvciwgRm9yYmlkZGVuRXJyb3IgfSBmcm9tICdAcmVkd29vZGpzL2dyYXBocWwtc2VydmVyJ1xuXG5pbXBvcnQgeyBkYiB9IGZyb20gJy4vZGInXG5cbi8qKlxuICogVGhlIG5hbWUgb2YgdGhlIGNvb2tpZSB0aGF0IGRiQXV0aCBzZXRzXG4gKlxuICogJXBvcnQlIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgcG9ydCB0aGUgYXBpIHNlcnZlciBpcyBydW5uaW5nIG9uLlxuICogSWYgeW91IGhhdmUgbXVsdGlwbGUgUlcgYXBwcyBydW5uaW5nIG9uIHRoZSBzYW1lIGhvc3QsIHlvdSdsbCBuZWVkIHRvXG4gKiBtYWtlIHN1cmUgdGhleSBhbGwgdXNlIHVuaXF1ZSBjb29raWUgbmFtZXNcbiAqL1xuZXhwb3J0IGNvbnN0IGNvb2tpZU5hbWUgPSAnc2Vzc2lvbl8lcG9ydCUnXG5cbi8qKlxuICogVGhlIHNlc3Npb24gb2JqZWN0IHNlbnQgaW4gYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIGdldEN1cnJlbnRVc2VyKCkgd2lsbFxuICogaGF2ZSBhIHNpbmdsZSBrZXkgYGlkYCBjb250YWluaW5nIHRoZSB1bmlxdWUgSUQgb2YgdGhlIGxvZ2dlZCBpbiB1c2VyXG4gKiAod2hhdGV2ZXIgZmllbGQgeW91IHNldCBhcyBgYXV0aEZpZWxkcy5pZGAgaW4geW91ciBhdXRoIGZ1bmN0aW9uIGNvbmZpZykuXG4gKiBZb3UnbGwgbmVlZCB0byB1cGRhdGUgdGhlIGNhbGwgdG8gYGRiYCBiZWxvdyBpZiB5b3UgdXNlIGEgZGlmZmVyZW50IG1vZGVsXG4gKiBuYW1lIG9yIHVuaXF1ZSBmaWVsZCBuYW1lLCBmb3IgZXhhbXBsZTpcbiAqXG4gKiAgIHJldHVybiBhd2FpdCBkYi5wcm9maWxlLmZpbmRVbmlxdWUoeyB3aGVyZTogeyBlbWFpbDogc2Vzc2lvbi5pZCB9IH0pXG4gKiAgICAgICAgICAgICAgICAgICDilIDilIDilIDilKzilIDilIDilIAgICAgICAgICAgICAgICAgICAgICAgIOKUgOKUgOKUrOKUgOKUgFxuICogICAgICBtb2RlbCBhY2Nlc3NvciDilIDilJggICAgICB1bmlxdWUgaWQgZmllbGQgbmFtZSDilIDilJhcbiAqXG4gKiAhISBCRVdBUkUgISEgQW55dGhpbmcgcmV0dXJuZWQgZnJvbSB0aGlzIGZ1bmN0aW9uIHdpbGwgYmUgYXZhaWxhYmxlIHRvIHRoZVxuICogY2xpZW50LS1pdCBiZWNvbWVzIHRoZSBjb250ZW50IG9mIGBjdXJyZW50VXNlcmAgb24gdGhlIHdlYiBzaWRlIChhcyB3ZWxsIGFzXG4gKiBgY29udGV4dC5jdXJyZW50VXNlcmAgb24gdGhlIGFwaSBzaWRlKS4gWW91IHNob3VsZCBjYXJlZnVsbHkgYWRkIGFkZGl0aW9uYWxcbiAqIGZpZWxkcyB0byB0aGUgYHNlbGVjdGAgb2JqZWN0IGJlbG93IG9uY2UgeW91J3ZlIGRlY2lkZWQgdGhleSBhcmUgc2FmZSB0byBiZVxuICogc2VlbiBpZiBzb21lb25lIHdlcmUgdG8gb3BlbiB0aGUgV2ViIEluc3BlY3RvciBpbiB0aGVpciBicm93c2VyLlxuICovXG5leHBvcnQgY29uc3QgZ2V0Q3VycmVudFVzZXIgPSBhc3luYyAoc2Vzc2lvbjogRGVjb2RlZCkgPT4ge1xuICBpZiAoIXNlc3Npb24gfHwgdHlwZW9mIHNlc3Npb24uaWQgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHNlc3Npb24nKVxuICB9XG5cbiAgcmV0dXJuIGF3YWl0IGRiLnVzZXIuZmluZFVuaXF1ZSh7XG4gICAgd2hlcmU6IHsgaWQ6IHNlc3Npb24uaWQgfSxcbiAgICBzZWxlY3Q6IHsgaWQ6IHRydWUgfSxcbiAgfSlcbn1cblxuLyoqXG4gKiBUaGUgdXNlciBpcyBhdXRoZW50aWNhdGVkIGlmIHRoZXJlIGlzIGEgY3VycmVudFVzZXIgaW4gdGhlIGNvbnRleHRcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSBJZiB0aGUgY3VycmVudFVzZXIgaXMgYXV0aGVudGljYXRlZFxuICovXG5leHBvcnQgY29uc3QgaXNBdXRoZW50aWNhdGVkID0gKCk6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gISFjb250ZXh0LmN1cnJlbnRVc2VyXG59XG5cbi8qKlxuICogV2hlbiBjaGVja2luZyByb2xlIG1lbWJlcnNoaXAsIHJvbGVzIGNhbiBiZSBhIHNpbmdsZSB2YWx1ZSwgYSBsaXN0LCBvciBub25lLlxuICogWW91IGNhbiB1c2UgUHJpc21hIGVudW1zIHRvbyAoaWYgeW91J3JlIHVzaW5nIHRoZW0gZm9yIHJvbGVzKSwganVzdCBpbXBvcnQgeW91ciBlbnVtIHR5cGUgZnJvbSBgQHByaXNtYS9jbGllbnRgXG4gKi9cbnR5cGUgQWxsb3dlZFJvbGVzID0gc3RyaW5nIHwgc3RyaW5nW10gfCB1bmRlZmluZWRcblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIGN1cnJlbnRVc2VyIGlzIGF1dGhlbnRpY2F0ZWQgKGFuZCBhc3NpZ25lZCBvbmUgb2YgdGhlIGdpdmVuIHJvbGVzKVxuICpcbiAqIEBwYXJhbSByb2xlczoge0BsaW5rIEFsbG93ZWRSb2xlc30gLSBDaGVja3MgaWYgdGhlIGN1cnJlbnRVc2VyIGlzIGFzc2lnbmVkIG9uZSBvZiB0aGVzZSByb2xlc1xuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSAtIFJldHVybnMgdHJ1ZSBpZiB0aGUgY3VycmVudFVzZXIgaXMgbG9nZ2VkIGluIGFuZCBhc3NpZ25lZCBvbmUgb2YgdGhlIGdpdmVuIHJvbGVzLFxuICogb3Igd2hlbiBubyByb2xlcyBhcmUgcHJvdmlkZWQgdG8gY2hlY2sgYWdhaW5zdC4gT3RoZXJ3aXNlIHJldHVybnMgZmFsc2UuXG4gKi9cbmV4cG9ydCBjb25zdCBoYXNSb2xlID0gKHJvbGVzOiBBbGxvd2VkUm9sZXMpOiBib29sZWFuID0+IHtcbiAgaWYgKCFpc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgY29uc3QgY3VycmVudFVzZXJSb2xlcyA9IGNvbnRleHQuY3VycmVudFVzZXI/LnJvbGVzXG5cbiAgaWYgKHR5cGVvZiByb2xlcyA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIGN1cnJlbnRVc2VyUm9sZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyByb2xlcyB0byBjaGVjayBpcyBhIHN0cmluZywgY3VycmVudFVzZXIucm9sZXMgaXMgYSBzdHJpbmdcbiAgICAgIHJldHVybiBjdXJyZW50VXNlclJvbGVzID09PSByb2xlc1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShjdXJyZW50VXNlclJvbGVzKSkge1xuICAgICAgLy8gcm9sZXMgdG8gY2hlY2sgaXMgYSBzdHJpbmcsIGN1cnJlbnRVc2VyLnJvbGVzIGlzIGFuIGFycmF5XG4gICAgICByZXR1cm4gY3VycmVudFVzZXJSb2xlcz8uc29tZSgoYWxsb3dlZFJvbGUpID0+IHJvbGVzID09PSBhbGxvd2VkUm9sZSlcbiAgICB9XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShyb2xlcykpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjdXJyZW50VXNlclJvbGVzKSkge1xuICAgICAgLy8gcm9sZXMgdG8gY2hlY2sgaXMgYW4gYXJyYXksIGN1cnJlbnRVc2VyLnJvbGVzIGlzIGFuIGFycmF5XG4gICAgICByZXR1cm4gY3VycmVudFVzZXJSb2xlcz8uc29tZSgoYWxsb3dlZFJvbGUpID0+XG4gICAgICAgIHJvbGVzLmluY2x1ZGVzKGFsbG93ZWRSb2xlKVxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGN1cnJlbnRVc2VyUm9sZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyByb2xlcyB0byBjaGVjayBpcyBhbiBhcnJheSwgY3VycmVudFVzZXIucm9sZXMgaXMgYSBzdHJpbmdcbiAgICAgIHJldHVybiByb2xlcy5zb21lKChhbGxvd2VkUm9sZSkgPT4gY3VycmVudFVzZXJSb2xlcyA9PT0gYWxsb3dlZFJvbGUpXG4gICAgfVxuICB9XG5cbiAgLy8gcm9sZXMgbm90IGZvdW5kXG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIFVzZSByZXF1aXJlQXV0aCBpbiB5b3VyIHNlcnZpY2VzIHRvIGNoZWNrIHRoYXQgYSB1c2VyIGlzIGxvZ2dlZCBpbixcbiAqIHdoZXRoZXIgb3Igbm90IHRoZXkgYXJlIGFzc2lnbmVkIGEgcm9sZSwgYW5kIG9wdGlvbmFsbHkgcmFpc2UgYW5cbiAqIGVycm9yIGlmIHRoZXkncmUgbm90LlxuICpcbiAqIEBwYXJhbSByb2xlczoge0BsaW5rIEFsbG93ZWRSb2xlc30gLSBXaGVuIGNoZWNraW5nIHJvbGUgbWVtYmVyc2hpcCwgdGhlc2Ugcm9sZXMgZ3JhbnQgYWNjZXNzLlxuICpcbiAqIEByZXR1cm5zIC0gSWYgdGhlIGN1cnJlbnRVc2VyIGlzIGF1dGhlbnRpY2F0ZWQgKGFuZCBhc3NpZ25lZCBvbmUgb2YgdGhlIGdpdmVuIHJvbGVzKVxuICpcbiAqIEB0aHJvd3Mge0BsaW5rIEF1dGhlbnRpY2F0aW9uRXJyb3J9IC0gSWYgdGhlIGN1cnJlbnRVc2VyIGlzIG5vdCBhdXRoZW50aWNhdGVkXG4gKiBAdGhyb3dzIHtAbGluayBGb3JiaWRkZW5FcnJvcn0gSWYgdGhlIGN1cnJlbnRVc2VyIGlzIG5vdCBhbGxvd2VkIGR1ZSB0byByb2xlIHBlcm1pc3Npb25zXG4gKlxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vcmVkd29vZGpzL3JlZHdvb2QvdHJlZS9tYWluL3BhY2thZ2VzL2F1dGggZm9yIGV4YW1wbGVzXG4gKi9cbmV4cG9ydCBjb25zdCByZXF1aXJlQXV0aCA9ICh7IHJvbGVzIH06IHsgcm9sZXM/OiBBbGxvd2VkUm9sZXMgfSA9IHt9KSA9PiB7XG4gIGlmICghaXNBdXRoZW50aWNhdGVkKCkpIHtcbiAgICB0aHJvdyBuZXcgQXV0aGVudGljYXRpb25FcnJvcihcIllvdSBkb24ndCBoYXZlIHBlcm1pc3Npb24gdG8gZG8gdGhhdC5cIilcbiAgfVxuXG4gIGlmIChyb2xlcyAmJiAhaGFzUm9sZShyb2xlcykpIHtcbiAgICB0aHJvdyBuZXcgRm9yYmlkZGVuRXJyb3IoXCJZb3UgZG9uJ3QgaGF2ZSBhY2Nlc3MgdG8gZG8gdGhhdC5cIilcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7QUFDQSxTQUFTQSxtQkFBbUIsRUFBRUMsY0FBYyxFQStDakNDLE9BQU8sUUEvQ2tDLDJCQUEyQjtBQUUvRSxTQUFTQyxFQUFFOztBQUVYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxNQUFNQyxVQUFVLEdBQUcsZ0JBQWdCOztBQUUxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxNQUFNQyxjQUFjLEdBQUcsTUFBT0MsT0FBZ0IsSUFBSztFQUN4RCxJQUFJLENBQUNBLE9BQU8sSUFBSSxPQUFPQSxPQUFPLENBQUNDLEVBQUUsS0FBSyxRQUFRLEVBQUU7SUFDOUMsTUFBTSxJQUFJQyxLQUFLLENBQUMsaUJBQWlCLENBQUM7RUFDcEM7RUFFQSxPQUFPLE1BQU1MLEVBQUUsQ0FBQ00sSUFBSSxDQUFDQyxVQUFVLENBQUM7SUFDOUJDLEtBQUssRUFBRTtNQUFFSixFQUFFLEVBQUVELE9BQU8sQ0FBQ0M7SUFBRyxDQUFDO0lBQ3pCSyxNQUFNLEVBQUU7TUFBRUwsRUFBRSxFQUFFO0lBQUs7RUFDckIsQ0FBQyxDQUFDO0FBQ0osQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxNQUFNTSxlQUFlLEdBQUdBLENBQUEsS0FBZTtFQUM1QyxPQUFPLENBQUMsQ0FBQ1gsT0FBTyxDQUFDWSxXQUFXO0FBQzlCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sTUFBTUMsT0FBTyxHQUFJQyxLQUFtQixJQUFjO0VBQ3ZELElBQUksQ0FBQ0gsZUFBZSxDQUFDLENBQUMsRUFBRTtJQUN0QixPQUFPLEtBQUs7RUFDZDtFQUVBLE1BQU1JLGdCQUFnQixHQUFHZixPQUFPLENBQUNZLFdBQVcsRUFBRUUsS0FBSztFQUVuRCxJQUFJLE9BQU9BLEtBQUssS0FBSyxRQUFRLEVBQUU7SUFDN0IsSUFBSSxPQUFPQyxnQkFBZ0IsS0FBSyxRQUFRLEVBQUU7TUFDeEM7TUFDQSxPQUFPQSxnQkFBZ0IsS0FBS0QsS0FBSztJQUNuQyxDQUFDLE1BQU0sSUFBSUUsY0FBQSxDQUFjRCxnQkFBZ0IsQ0FBQyxFQUFFO01BQzFDO01BQ0EsT0FBT0EsZ0JBQWdCLEVBQUVFLElBQUksQ0FBRUMsV0FBVyxJQUFLSixLQUFLLEtBQUtJLFdBQVcsQ0FBQztJQUN2RTtFQUNGO0VBRUEsSUFBSUYsY0FBQSxDQUFjRixLQUFLLENBQUMsRUFBRTtJQUN4QixJQUFJRSxjQUFBLENBQWNELGdCQUFnQixDQUFDLEVBQUU7TUFDbkM7TUFDQSxPQUFPQSxnQkFBZ0IsRUFBRUUsSUFBSSxDQUFFQyxXQUFXLElBQ3hDQyx5QkFBQSxDQUFBTCxLQUFLLEVBQUFNLElBQUEsQ0FBTE4sS0FBSyxFQUFVSSxXQUFXLENBQzVCLENBQUM7SUFDSCxDQUFDLE1BQU0sSUFBSSxPQUFPSCxnQkFBZ0IsS0FBSyxRQUFRLEVBQUU7TUFDL0M7TUFDQSxPQUFPTSxxQkFBQSxDQUFBUCxLQUFLLEVBQUFNLElBQUEsQ0FBTE4sS0FBSyxFQUFPSSxXQUFXLElBQUtILGdCQUFnQixLQUFLRyxXQUFXLENBQUM7SUFDdEU7RUFDRjs7RUFFQTtFQUNBLE9BQU8sS0FBSztBQUNkLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sTUFBTUksV0FBVyxHQUFHQSxDQUFDO0VBQUVSO0FBQWdDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSztFQUN2RSxJQUFJLENBQUNILGVBQWUsQ0FBQyxDQUFDLEVBQUU7SUFDdEIsTUFBTSxJQUFJYixtQkFBbUIsQ0FBQyx1Q0FBdUMsQ0FBQztFQUN4RTtFQUVBLElBQUlnQixLQUFLLElBQUksQ0FBQ0QsT0FBTyxDQUFDQyxLQUFLLENBQUMsRUFBRTtJQUM1QixNQUFNLElBQUlmLGNBQWMsQ0FBQyxtQ0FBbUMsQ0FBQztFQUMvRDtBQUNGLENBQUMifQ==