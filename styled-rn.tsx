import React, { PropsWithoutRef, PropsWithRef, ReactNode, useContext } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  SectionList,
  StyleProp,
  Text,
  TextInput,
  TextProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { postStyles } from "./poststyles";
import { StyledRNThemeContext } from "./theme";
import {
  OptionalThemedProps,
  StyleableProps,
  StyledOptions,
  ThemedProps,
  ThemedPropsKeys,
} from "./types";

export function styled<
  CustomProps extends ThemedProps,
  StyledComponentProps extends StyleableProps
>(
  Component: React.ComponentType<StyledComponentProps>,
  style: StyledComponentProps["style"] | ((props: CustomProps) => StyledComponentProps["style"]),
  options?: StyledOptions<StyledComponentProps>
) {
  const { useDebugStyles, attrs, children } = options || {};

  // eslint-disable-next-line react/display-name
  return (
    props: Omit<CustomProps, ThemedPropsKeys> & OptionalThemedProps & StyledComponentProps
  ) => {
    const themeContext = useContext(StyledRNThemeContext);
    const theme = themeContext?.theme || {};
    const ctx = themeContext?.ctx || {};
    const root = themeContext?.root;

    const themedProps = {
      ...(props as Record<string, unknown>),
      theme,
      ctx,
    } as CustomProps;

    const computedStyles = style instanceof Function ? style(themedProps) : style;

    const newStyles = Array.isArray(computedStyles)
      ? [root?.styles, ...computedStyles, props.style]
      : [root?.styles, computedStyles, props.style];

    postStyles(newStyles, root, useDebugStyles);

    const computedProps = {
      ...(props as Record<string, unknown>),
      ...(attrs || {}),
    } as StyledComponentProps;

    if (children) {
      return (
        <Component {...computedProps} style={newStyles}>
          {children}
        </Component>
      );
    } else {
      return <Component {...computedProps} style={newStyles} />;
    }
  };
}

const makeStyledKey =
  <StyledComponentProps extends StyleableProps>(
    Component: React.ComponentType<StyledComponentProps>
  ) =>
  <CustomProps extends ThemedProps>(
    style: StyledComponentProps["style"] | ((props: CustomProps) => StyledComponentProps["style"]),
    options?: StyledOptions<StyledComponentProps>
  ) =>
    styled(Component, style, options);

styled.SafeAreaView = makeStyledKey(SafeAreaView);
styled.View = makeStyledKey(View);
styled.Text = makeStyledKey(Text);
styled.TextInput = makeStyledKey(TextInput);
styled.Image = makeStyledKey(Image);
styled.FlatList = makeStyledKey(FlatList);
styled.ScrollView = makeStyledKey(ScrollView);
styled.SectionList = makeStyledKey(SectionList);
styled.TouchableOpacity = makeStyledKey(TouchableOpacity);

// const makeStyledContainerWithItem =
//   <ContainerProps extends StyleableProps, ItemProps extends StyleableProps>(
//     Container: React.ComponentType<ContainerProps>,
//     Item: React.ComponentType<ItemProps>
//   ) =>
//   <
//     CustomProps extends ThemedProps,
//     ContainerStyle extends ContainerProps["style"],
//     ItemStyle extends ItemProps["style"]
//   >(
//     {
//       container: containerStyle,
//       item: itemStyle,
//     }: {
//       container: ContainerStyle | ((props: CustomProps & ThemedProps) => ContainerStyle);
//       item: ItemStyle | ((props: CustomProps & ThemedProps) => ItemStyle);
//     },
//     options?: { container?: StyledOptions<ContainerProps>; item?: StyledOptions<ItemProps> }
//   ) => {
//     const { container: containerOptions, item: itemOptions } = options || {};
//     const StyledItem = styled(Item, itemStyle, itemOptions);
//     const StyledContainer = styled(Container, containerStyle, {
//       ...containerOptions,
//       children: [StyledItem],
//     });

//     return StyledContainer;
//   };

//   styled.ViewText = makeStyledContainerWithItem(View, Text);
