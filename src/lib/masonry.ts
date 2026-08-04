/**
 * Deterministic masonry via CSS Grid row-spans, computed server-side from
 * each photo's aspect ratio. Avoids Chromium's column-balancing bugs with
 * `columns-*` + `break-inside-avoid`, which can leave large empty gaps for
 * long, uneven lists.
 */
export const MASONRY_ROW_PX = 8;
export const MASONRY_GAP_PX = 16;
const ASSUMED_COLUMN_WIDTH_PX = 380;

export function masonrySpan(width: number, height: number) {
  const itemHeight = ASSUMED_COLUMN_WIDTH_PX * (height / width);
  return Math.ceil(
    (itemHeight + MASONRY_GAP_PX) / (MASONRY_ROW_PX + MASONRY_GAP_PX),
  );
}
