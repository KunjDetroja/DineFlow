import { logout } from "./user.slice";
import { authApi } from "@/store/services/auth.service"
import { userApi } from "@/store/services/user.service";
import { outletApi } from "@/store/services/outlet.service";
import { restaurantApi } from "@/store/services/restaurant.service";
import { inquiryApi } from "@/store/services/inquiry.service";


export const logoutUser = () => (dispatch) => {
  dispatch(logout()); // clear user state + localStorage

  // Reset RTK Query caches

  dispatch(authApi.util.resetApiState());
  dispatch(userApi.util.resetApiState());
  dispatch(outletApi.util.resetApiState());
  dispatch(restaurantApi.util.resetApiState());
  dispatch(inquiryApi.util.resetApiState());
};
