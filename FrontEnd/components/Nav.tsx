import AccIcon from "@/assets/svg-icons/AccIcon";
import HomeIcon from "@/assets/svg-icons/HomeIcon";
import { scaleWidth, scaleHeight } from "@/utils/scale";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";

export default function Nav(props: { active: "home" | "account" | "survey" }) {
  return (
    <View
      style={{
        // ai code
        bottom: 0,
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#23272A", // This will cover the white bar
        alignItems: "center",
        gap: scaleWidth(38),
        height: scaleHeight(70),
        width: "60%",
        borderRadius: 40,
        marginLeft: scaleHeight(80),
        justifyContent: "center",
      }}
    >
      <Link href="/" asChild>
        <Pressable>
          <HomeIcon
            width={24}
            height={24}
            color={props.active === "home" ? "#C7E67B" : "white"}
          />
        </Pressable>
      </Link>
      <Link href="/survey" asChild>
        <Pressable>
          <AccIcon
            width={24}
            height={24}
            color={props.active === "account" ? "#C7E67B" : "white"}
          />
        </Pressable>
      </Link>
      <Link href="/authpage" asChild>
        <Pressable>
          <AccIcon
            width={24}
            height={24}
            color={props.active === "survey" ? "#C7E67B" : "white"}
          />
        </Pressable>
      </Link>
    </View>
  );
}
