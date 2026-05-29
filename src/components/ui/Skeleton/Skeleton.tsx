import React from 'react';
import './Skeleton.scss';

export type SkeletonVariant = 'text' | 'rect' | 'circle';
export type SkeletonAnimation = 'shimmer' | 'pulse' | 'none';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  active?: boolean; // Convenience prop to enable shimmer animation (Antd style)
}

const Skeleton = ({
  variant = 'text',
  animation,
  width,
  height,
  borderRadius,
  active = true,
  className = '',
  style,
  children,
  ...rest
}: SkeletonProps) => {
  // If active is true and no animation is specified, default to shimmer
  const selectedAnimation = animation || (active ? 'shimmer' : 'none');

  const classes = [
    'skeleton',
    `skeleton--${variant}`,
    selectedAnimation !== 'none' ? `skeleton--${selectedAnimation}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const customStyle: React.CSSProperties = {
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(borderRadius !== undefined && { borderRadius }),
    ...style,
  };

  return (
    <div className={classes} style={customStyle} {...rest}>
      {children}
    </div>
  );
};

// ─── Sub-components for compatibility/convenience ────────────

export interface SkeletonButtonProps extends Omit<SkeletonProps, 'variant'> {
  shape?: 'circle' | 'square' | 'round';
  size?: 'small' | 'default' | 'large';
}

const SkeletonButton = ({
  shape = 'square',
  size = 'default',
  style,
  borderRadius,
  width,
  height,
  ...rest
}: SkeletonButtonProps) => {
  // Set default dimensions based on size
  const defaultHeight = size === 'small' ? '24px' : size === 'large' ? '40px' : '32px';
  const defaultWidth = size === 'small' ? '64px' : size === 'large' ? '120px' : '88px';

  // Set border radius based on shape
  let resolvedBorderRadius = borderRadius;
  if (borderRadius === undefined) {
    if (shape === 'round') {
      resolvedBorderRadius = '999px';
    } else if (shape === 'circle') {
      resolvedBorderRadius = '50%';
    } else {
      resolvedBorderRadius = 'var(--radius-sm, 6px)';
    }
  }

  return (
    <Skeleton
      variant={shape === 'circle' ? 'circle' : 'rect'}
      width={width ?? defaultWidth}
      height={height ?? defaultHeight}
      borderRadius={resolvedBorderRadius}
      style={style}
      {...rest}
    />
  );
};

export interface SkeletonInputProps extends Omit<SkeletonProps, 'variant'> {
  size?: 'small' | 'default' | 'large';
}

const SkeletonInput = ({
  size = 'default',
  style,
  width,
  height,
  borderRadius = 'var(--radius-sm, 6px)',
  ...rest
}: SkeletonInputProps) => {
  const defaultHeight = size === 'small' ? '24px' : size === 'large' ? '40px' : '32px';
  const defaultWidth = '160px';

  return (
    <Skeleton
      variant="rect"
      width={width ?? defaultWidth}
      height={height ?? defaultHeight}
      borderRadius={borderRadius}
      style={style}
      {...rest}
    />
  );
};

// ─── High-level Ant-design compatible list layout ─────────────

export interface SkeletonParagraphProps {
  rows?: number;
  width?: string | number | Array<string | number>;
}

export interface SkeletonTitleProps {
  width?: string | number;
}

export interface SkeletonContainerProps extends Omit<SkeletonProps, 'title'> {
  paragraph?: boolean | SkeletonParagraphProps;
  title?: boolean | SkeletonTitleProps;
}

const SkeletonContainer = ({
  paragraph = true,
  title = true,
  active = true,
  style,
  className = '',
  ...rest
}: SkeletonContainerProps) => {
  // If rendering children directly instead of generating placeholder lines
  const hasConfig = paragraph !== false || title !== false;

  if (!hasConfig) {
    return <Skeleton active={active} style={style} className={className} {...rest} />;
  }

  // Generate Title Element
  let titleEl: React.ReactNode = null;
  if (title !== false) {
    const titleConfig = typeof title === 'object' ? title : {};
    const titleWidth = titleConfig.width ?? '38%';
    titleEl = (
      <Skeleton
        variant="text"
        active={active}
        width={titleWidth}
        height="18px"
        style={{ marginBottom: '16px', borderRadius: '4px' }}
      />
    );
  }

  // Generate Paragraph Element
  let paragraphEl: React.ReactNode = null;
  if (paragraph !== false) {
    const paraConfig = typeof paragraph === 'object' ? paragraph : {};
    const rowsCount = paraConfig.rows ?? 3;
    const widths = paraConfig.width;

    paragraphEl = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        {Array.from({ length: rowsCount }).map((_, i) => {
          let rowWidth: string | number = '100%';
          if (widths !== undefined) {
            if (Array.isArray(widths)) {
              rowWidth = widths[i] ?? '100%';
            } else {
              rowWidth = widths;
            }
          } else {
            // Default elegant staggered widths
            if (i === rowsCount - 1) rowWidth = '60%';
            else if (i % 2 === 1) rowWidth = '90%';
          }

          return (
            <Skeleton
              key={i}
              variant="text"
              active={active}
              width={rowWidth}
              height="14px"
              style={{ borderRadius: '4px' }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`skeleton-container ${className}`}
      style={{ width: '100%', ...style }}
      {...rest}
    >
      {titleEl}
      {paragraphEl}
    </div>
  );
};

// Bind subcomponents to Skeleton component function object
type SkeletonComponentType = typeof SkeletonContainer & {
  Button: typeof SkeletonButton;
  Input: typeof SkeletonInput;
};

const ExportedSkeleton = SkeletonContainer as SkeletonComponentType;
ExportedSkeleton.Button = SkeletonButton;
ExportedSkeleton.Input = SkeletonInput;

export default ExportedSkeleton;
