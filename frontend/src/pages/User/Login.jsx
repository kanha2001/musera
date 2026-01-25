const navigate = useNavigate();
const location = useLocation();
const dispatch = useDispatch();

const { error, loading, isAuthenticated } = useSelector((state) => state.user);

// URL se redirect path nikalo (e.g. "shipping")
const redirect = location.search ? location.search.split("=")[1] : "/account";

useEffect(() => {
  if (error) {
    toast.error(error);
    dispatch(clearErrors());
  }

  if (isAuthenticated) {
    // Agar login success ho gaya, to jahan jana tha wahan bhejo
    navigate(`/${redirect}`);
  }
}, [dispatch, error, isAuthenticated, navigate, redirect]);
