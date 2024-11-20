import { Router } from '@angular/router';
import { inject} from "@angular/core"
import { AuthService } from "../services/auth-service/auth.service"



export const authGuardFnCheckOut=() => {
  const authService= inject(AuthService)
  const router = inject(Router);

  if(authService.isCheckoutEnabled()){
    return true;
  }else{
    router.navigate(['/unauthorized']);
    return false;
  }

}
