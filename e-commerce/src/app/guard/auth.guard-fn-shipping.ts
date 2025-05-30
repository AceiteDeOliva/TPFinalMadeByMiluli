import { Router } from '@angular/router';
import { inject} from "@angular/core"
import { AuthService } from "../services/auth-service/auth.service"



export const authGuardFnShipping=() => {
  const authService= inject(AuthService)
  const router = inject(Router);

  if(authService.isShippingEnabled()){
    return true;
  }else{
    router.navigate(['/unauthorized']);
    return false;
  }

}
