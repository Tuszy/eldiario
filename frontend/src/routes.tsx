// Icons
import {
  Home as HomeIcon,
  Person as ProfileIcon,
  PersonSearch as ProfilesIcon,
  PeopleAlt as SubscriberIcon,
  Star as SubscriptionIcon,
  AlternateEmail as TagIcon,
  Notifications as NotificationIcon,
  Favorite as LikedPostIcon,
  ChatBubbleOutline as PostIcon,
} from "@mui/icons-material";

// Pages
import Home from "./pages/Home/Home";
import ProfileList from "./pages/Profiles/ProfileList";
import PostList from "./pages/Posts/PostList";
import CommentList from "./pages/Comments/CommentList";
import ShareList from "./pages/Shares/ShareList";
import SubscriptionList from "./pages/Subscriptions/SubscriptionList";
import SubscriberList from "./pages/Subscribers/SubscriberList";
import Profile from "./pages/Profile/Profile";
import PostLikeList from "./pages/PostLikes/PostLikeList";
import PostTagList from "./pages/PostTags/PostTagList";
import UserLikeList from "./pages/UserLikes/UserLikeList";
import UserTagList from "./pages/UserTags/UserTagList";
import Post from "./pages/Post/Post";

// Helper
import _ from "lodash";

// Types
import { Route } from "./types/Route.d";

export const routes: Route[] = [
  {
    name: "Home",
    path: "/",
    icon: HomeIcon,
    component: Home,
  },
  {
    name: "Profiles",
    path: "/profiles",
    icon: ProfilesIcon,
    component: ProfileList,
  },
  {
    name: "Posts",
    path: "/posts",
    icon: PostIcon,
    component: PostList,
    hideIfUnregistered: true,
  },
  {
    name: "Liked Posts",
    path: "/likes",
    icon: LikedPostIcon,
    component: PostLikeList,
    hideIfUnregistered: true,
  },
  {
    name: "Subscribers",
    path: "/subscribers",
    icon: SubscriberIcon,
    component: SubscriberList,
    hideIfUnregistered: true,
  },
  {
    name: "Subscriptions",
    path: "/subscriptions",
    icon: SubscriptionIcon,
    component: SubscriptionList,
    hideIfUnregistered: true,
  },
  {
    name: "Post Tags",
    path: "/tags",
    icon: TagIcon,
    component: PostTagList,
    hideIfUnregistered: true,
  },
  // {
  //   name: "Notifications",
  //   path: "/notifications",
  //   icon: NotificationIcon,
  //   component: Home,
  //   hideIfUnregistered: true,
  // },
  {
    name: "Profile",
    path: "/profile",
    icon: ProfileIcon,
    component: Profile,
    hideIfUnregistered: true,
  },

  {
    name: "Post",
    path: "/post/:id",
    hideInDrawer: true,
    component: Post,
  },
  {
    name: "Profile",
    path: "/profile/:id",
    hideInDrawer: true,
    component: Profile,
  },
  {
    name: "Posts",
    path: "/profile/:id/posts",
    hideInDrawer: true,
    component: PostList,
  },
  {
    name: "Liked Posts",
    path: "/profile/:id/likes",
    hideInDrawer: true,
    component: PostLikeList,
  },
  {
    name: "Subscribers",
    path: "/profile/:id/subscribers",
    hideInDrawer: true,
    component: SubscriberList,
  },
  {
    name: "Subscriptions",
    path: "/profile/:id/subscriptions",
    hideInDrawer: true,
    component: SubscriptionList,
  },
  {
    name: "Post Tags",
    path: "/profile/:id/tags",
    hideInDrawer: true,
    component: PostTagList,
  },

  {
    name: "Comments",
    path: "/post/:id/comments",
    hideInDrawer: true,
    component: CommentList,
  },
  {
    name: "Shares",
    path: "/post/:id/shares",
    hideInDrawer: true,
    component: ShareList,
  },
  {
    name: "User Likes",
    path: "/post/:id/likes",
    hideInDrawer: true,
    component: UserLikeList,
  },
  {
    name: "User Tags",
    path: "/post/:id/tags",
    hideInDrawer: true,
    component: UserTagList,
  },
];
