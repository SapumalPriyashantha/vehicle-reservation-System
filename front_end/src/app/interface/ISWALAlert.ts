export interface ISWALAlert {
  title?: string;
  html?: string;
  text?: string;
  showCancelButton?: boolean;
  showCloseButton?: boolean;
  cancelButtonCss?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  iconHtml?: string;
  customClass?: Record<string, string>;
  reverseButtons?: boolean;
}
