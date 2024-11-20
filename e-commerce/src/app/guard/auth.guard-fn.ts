import { AuthService } from './../services/auth-service/auth.service';
import { inject } from "@angular/core";
import { Router } from "@angular/router";  // Correct import for Angular router
import { UserService } from '../services/user-service/user.service';

export const authGuardFn = async (allowedCredentials: string[]) => {
  const userService = inject(UserService);
  const router = inject(Router);


  const currentUser = localStorage.getItem('currentUserId');

  if (currentUser) {
    // Get the user credential from the UserService
    try {
      const userCredential = await userService.getCredential(currentUser).toPromise();

      if (userCredential && allowedCredentials.includes(userCredential)) {

        return true;
      } else {

        router.navigate(['/unauthorized']);
        return false;
      }
    } catch (error) {
      router.navigate(['/unauthorized']);
      return false;
    }
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
};
