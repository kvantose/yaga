// antd-provider.tsx
"use client";

import { ConfigProvider, theme } from "antd";

export const AntdProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "var(--color-primary)",
          colorPrimaryHover: "var(--color-accent)",
          colorPrimaryActive: "var(--color-text-secondary)",

          colorBgContainer: "var(--color-surface)",
          colorBorder: "var(--color-border)",
          colorBorderSecondary: "var(--color-border)",

          colorText: "var(--color-text-primary)",
          colorTextSecondary: "var(--color-text-secondary)",
          colorTextQuaternary: "var(--color-text-secondary)",

          colorSuccess: "var(--color-success)",
          colorError: "var(--color-error)",
          colorWarning: "#faad14",

          borderRadius: 8,
          borderRadiusLG: 12,
          borderRadiusSM: 6,

          fontFamily: `'Inter', 'Helvetica Neue', sans-serif`,
          fontSize: 14,
          lineHeight: 1.5715,

          // Анимации
          motionDurationMid: "0.2s",
          motionDurationSlow: "0.3s",
          motionEaseInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
          motionEaseOut: "cubic-bezier(0.0, 0, 0.2, 1)",
        },

        components: {
          Button: {
            // Основные кнопки
            colorPrimary: "var(--color-primary)",
            colorPrimaryHover: "var(--color-accent)",
            colorPrimaryActive: "var(--color-text-secondary)",

            colorBgContainer: "var(--color-border)",
            colorBgContainerDisabled: "var(--color-background)",

            colorText: "var(--color-text-primary)",
            colorTextDisabled: "var(--color-text-secondary)",

            colorBorder: "var(--color-border)",
            colorBorderSecondary: "var(--color-border)",

            borderRadius: 8,
            borderRadiusLG: 12,
            borderRadiusSM: 6,

            // Размеры
            paddingInline: 20,
            paddingInlineLG: 24,
            paddingInlineSM: 16,

            fontSize: 14,
            fontSizeLG: 16,
            fontSizeSM: 12,

            lineHeight: 1.5715,
            lineHeightLG: 1.5,
            lineHeightSM: 1.6667,

            // Анимации и эффекты
            controlHeight: 36,
            controlHeightLG: 44,
            controlHeightSM: 28,

            motionDurationMid: "0.2s",
            motionDurationSlow: "0.3s",

            // Эффекты при наведении
            boxShadow: "none",
            boxShadowSecondary: "0 2px 8px rgba(0, 0, 0, 0.1)",


            // Градиент и трансформации для primary кнопок
            primaryShadow: "0 2px 0 rgba(0, 0, 0, 0.045)",

            // Трансформации при наведении
            controlOutline: "none",
            controlOutlineWidth: 0,

            // Псевдоэлементы для анимации
            colorLink: "var(--color-accent)",
            colorLinkHover: "var(--color-primary)",

            // Скругления
            borderRadiusOuter: 4,
          },

          Input: {
            colorBgContainer: "var(--color-surface)",
            colorBorder: "var(--color-border)",
            colorPrimaryHover: "var(--color-accent)",
            borderRadius: 8,
            activeBorderColor: "var(--color-accent)",
            hoverBorderColor: "var(--color-accent)",
            paddingInline: 12,
            paddingBlock: 8,
          },

          Select: {
            colorBgContainer: "var(--color-surface)",
            colorBorder: "var(--color-border)",
            colorPrimaryHover: "var(--color-accent)",
            borderRadius: 8,
            optionSelectedBg: "var(--color-surface)",
            optionActiveBg: "var(--color-background)",
          },

          Card: {
            colorBgContainer: "var(--color-surface)",
            colorBorder: "var(--color-border)",
            borderRadius: 12,
            borderRadiusLG: 16,
            boxShadowTertiary:
              "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
          },

          Modal: {
            colorBgElevated: "var(--color-surface)",
            borderRadiusLG: 16,
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
