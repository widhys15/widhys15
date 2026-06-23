export interface StatusMeta {
  label: string;   // lowercase; caller cases it per context
  active: boolean; // still being worked on (building / improving)
  mark: string;    // glyph prefix
}

/** Shared project-status presentation, used by the flagship, list, and detail. */
export function statusMeta(status: string): StatusMeta {
  switch (status) {
    case 'in-progress': return { label: 'building', active: true, mark: '●' };
    case 'improving':   return { label: 'improving', active: true, mark: '●' };
    default:            return { label: 'complete', active: false, mark: '✓' };
  }
}

export const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
