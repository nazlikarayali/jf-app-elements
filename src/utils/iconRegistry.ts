import { icons as lucideIcons } from 'lucide-react';
import type { ComponentType } from 'react';

export type IconLibrary = 'lucide' | 'phosphor' | 'heroicons' | 'tabler';

export const ICON_LIBRARIES: { value: IconLibrary; label: string }[] = [
  { value: 'lucide', label: 'Lucide' },
  { value: 'phosphor', label: 'Phosphor' },
  { value: 'heroicons', label: 'Heroicons' },
  { value: 'tabler', label: 'Tabler' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconComp = ComponentType<any>;

// Cross-library name mapping: Lucide canonical → library-native export name
const NAME_MAP: Record<string, Partial<Record<IconLibrary, string>>> = {
  // Navigation
  ArrowRight: { phosphor: 'ArrowRight', heroicons: 'ArrowRightIcon', tabler: 'IconArrowRight' },
  ArrowLeft: { phosphor: 'ArrowLeft', heroicons: 'ArrowLeftIcon', tabler: 'IconArrowLeft' },
  ArrowUp: { phosphor: 'ArrowUp', heroicons: 'ArrowUpIcon', tabler: 'IconArrowUp' },
  ArrowDown: { phosphor: 'ArrowDown', heroicons: 'ArrowDownIcon', tabler: 'IconArrowDown' },
  ArrowUpRight: { phosphor: 'ArrowUpRight', heroicons: 'ArrowUpRightIcon', tabler: 'IconArrowUpRight' },
  ChevronRight: { phosphor: 'CaretRight', heroicons: 'ChevronRightIcon', tabler: 'IconChevronRight' },
  ChevronLeft: { phosphor: 'CaretLeft', heroicons: 'ChevronLeftIcon', tabler: 'IconChevronLeft' },
  ChevronDown: { phosphor: 'CaretDown', heroicons: 'ChevronDownIcon', tabler: 'IconChevronDown' },
  ChevronUp: { phosphor: 'CaretUp', heroicons: 'ChevronUpIcon', tabler: 'IconChevronUp' },
  ExternalLink: { phosphor: 'ArrowSquareOut', heroicons: 'ArrowTopRightOnSquareIcon', tabler: 'IconExternalLink' },

  // Actions
  Plus: { phosphor: 'Plus', heroicons: 'PlusIcon', tabler: 'IconPlus' },
  Minus: { phosphor: 'Minus', heroicons: 'MinusIcon', tabler: 'IconMinus' },
  X: { phosphor: 'X', heroicons: 'XMarkIcon', tabler: 'IconX' },
  Check: { phosphor: 'Check', heroicons: 'CheckIcon', tabler: 'IconCheck' },
  Search: { phosphor: 'MagnifyingGlass', heroicons: 'MagnifyingGlassIcon', tabler: 'IconSearch' },
  Edit: { phosphor: 'PencilSimple', heroicons: 'PencilIcon', tabler: 'IconEdit' },
  Trash2: { phosphor: 'Trash', heroicons: 'TrashIcon', tabler: 'IconTrash' },
  Copy: { phosphor: 'Copy', heroicons: 'DocumentDuplicateIcon', tabler: 'IconCopy' },
  Download: { phosphor: 'DownloadSimple', heroicons: 'ArrowDownTrayIcon', tabler: 'IconDownload' },
  Upload: { phosphor: 'UploadSimple', heroicons: 'ArrowUpTrayIcon', tabler: 'IconUpload' },
  Share: { phosphor: 'ShareNetwork', heroicons: 'ShareIcon', tabler: 'IconShare' },
  Send: { phosphor: 'PaperPlaneRight', heroicons: 'PaperAirplaneIcon', tabler: 'IconSend' },
  RefreshCw: { phosphor: 'ArrowsClockwise', heroicons: 'ArrowPathIcon', tabler: 'IconRefresh' },
  Filter: { phosphor: 'Funnel', heroicons: 'FunnelIcon', tabler: 'IconFilter' },
  MoreHorizontal: { phosphor: 'DotsThree', heroicons: 'EllipsisHorizontalIcon', tabler: 'IconDots' },
  MoreVertical: { phosphor: 'DotsThreeVertical', heroicons: 'EllipsisVerticalIcon', tabler: 'IconDotsVertical' },
  Save: { phosphor: 'FloppyDisk', heroicons: 'ArrowDownOnSquareIcon', tabler: 'IconDeviceFloppy' },
  Undo: { phosphor: 'ArrowCounterClockwise', heroicons: 'ArrowUturnLeftIcon', tabler: 'IconArrowBackUp' },

  // Files & Data
  CirclePlus: { phosphor: 'PlusCircle', heroicons: 'PlusCircleIcon', tabler: 'IconCirclePlus' },
  FileText: { phosphor: 'FileText', heroicons: 'DocumentTextIcon', tabler: 'IconFileText' },
  ClipboardList: { phosphor: 'ClipboardText', heroicons: 'ClipboardDocumentListIcon', tabler: 'IconClipboardList' },
  Asterisk: { phosphor: 'Asterisk', heroicons: 'StarIcon', tabler: 'IconAsterisk' },
  CloudUpload: { phosphor: 'CloudArrowUp', heroicons: 'CloudArrowUpIcon', tabler: 'IconCloudUpload' },
  Table2: { phosphor: 'Table', heroicons: 'TableCellsIcon', tabler: 'IconTable' },
  FilePenLine: { phosphor: 'PencilLine', heroicons: 'PencilSquareIcon', tabler: 'IconFilePencil' },
  File: { phosphor: 'File', heroicons: 'DocumentIcon', tabler: 'IconFile' },
  Folder: { phosphor: 'Folder', heroicons: 'FolderIcon', tabler: 'IconFolder' },
  Database: { phosphor: 'Database', heroicons: 'CircleStackIcon', tabler: 'IconDatabase' },
  BookOpen: { phosphor: 'BookOpen', heroicons: 'BookOpenIcon', tabler: 'IconBook' },
  Bookmark: { phosphor: 'BookmarkSimple', heroicons: 'BookmarkIcon', tabler: 'IconBookmark' },
  Paperclip: { phosphor: 'Paperclip', heroicons: 'PaperClipIcon', tabler: 'IconPaperclip' },
  Link: { phosphor: 'Link', heroicons: 'LinkIcon', tabler: 'IconLink' },
  Archive: { phosphor: 'Archive', heroicons: 'ArchiveBoxIcon', tabler: 'IconArchive' },

  // Communication
  MessageCircle: { phosphor: 'ChatCircle', heroicons: 'ChatBubbleOvalLeftIcon', tabler: 'IconMessageCircle' },
  MessageSquare: { phosphor: 'ChatSquare', heroicons: 'ChatBubbleLeftIcon', tabler: 'IconMessage' },
  Mail: { phosphor: 'Envelope', heroicons: 'EnvelopeIcon', tabler: 'IconMail' },
  Phone: { phosphor: 'Phone', heroicons: 'PhoneIcon', tabler: 'IconPhone' },
  Video: { phosphor: 'VideoCamera', heroicons: 'VideoCameraIcon', tabler: 'IconVideo' },
  Bell: { phosphor: 'Bell', heroicons: 'BellIcon', tabler: 'IconBell' },
  Globe: { phosphor: 'Globe', heroicons: 'GlobeAltIcon', tabler: 'IconWorld' },
  AtSign: { phosphor: 'At', heroicons: 'AtSymbolIcon', tabler: 'IconAt' },
  Inbox: { phosphor: 'Tray', heroicons: 'InboxIcon', tabler: 'IconInbox' },

  // People
  User: { phosphor: 'User', heroicons: 'UserIcon', tabler: 'IconUser' },
  Users: { phosphor: 'Users', heroicons: 'UsersIcon', tabler: 'IconUsers' },
  UserPlus: { phosphor: 'UserPlus', heroicons: 'UserPlusIcon', tabler: 'IconUserPlus' },

  // Social
  Heart: { phosphor: 'Heart', heroicons: 'HeartIcon', tabler: 'IconHeart' },
  Star: { phosphor: 'Star', heroicons: 'StarIcon', tabler: 'IconStar' },
  ThumbsUp: { phosphor: 'ThumbsUp', heroicons: 'HandThumbUpIcon', tabler: 'IconThumbUp' },

  // Social Media
  Youtube: { phosphor: 'YoutubeLogo', heroicons: 'PlayCircleIcon', tabler: 'IconBrandYoutube' },
  Twitter: { phosphor: 'TwitterLogo', heroicons: 'ChatBubbleLeftIcon', tabler: 'IconBrandTwitter' },
  Linkedin: { phosphor: 'LinkedinLogo', heroicons: 'BriefcaseIcon', tabler: 'IconBrandLinkedin' },
  Instagram: { phosphor: 'InstagramLogo', heroicons: 'CameraIcon', tabler: 'IconBrandInstagram' },
  Facebook: { phosphor: 'FacebookLogo', heroicons: 'UserGroupIcon', tabler: 'IconBrandFacebook' },
  Github: { phosphor: 'GithubLogo', heroicons: 'CodeBracketIcon', tabler: 'IconBrandGithub' },

  // Commerce
  ShoppingCart: { phosphor: 'ShoppingCart', heroicons: 'ShoppingCartIcon', tabler: 'IconShoppingCart' },
  CreditCard: { phosphor: 'CreditCard', heroicons: 'CreditCardIcon', tabler: 'IconCreditCard' },
  DollarSign: { phosphor: 'CurrencyDollar', heroicons: 'CurrencyDollarIcon', tabler: 'IconCurrencyDollar' },
  Package: { phosphor: 'Package', heroicons: 'CubeIcon', tabler: 'IconPackage' },
  Tag: { phosphor: 'Tag', heroicons: 'TagIcon', tabler: 'IconTag' },
  Gift: { phosphor: 'Gift', heroicons: 'GiftIcon', tabler: 'IconGift' },

  // Interface
  Home: { phosphor: 'House', heroicons: 'HomeIcon', tabler: 'IconHome' },
  Menu: { phosphor: 'List', heroicons: 'Bars3Icon', tabler: 'IconMenu2' },
  Settings: { phosphor: 'Gear', heroicons: 'Cog6ToothIcon', tabler: 'IconSettings' },
  Sliders: { phosphor: 'SlidersHorizontal', heroicons: 'AdjustmentsHorizontalIcon', tabler: 'IconAdjustments' },
  Eye: { phosphor: 'Eye', heroicons: 'EyeIcon', tabler: 'IconEye' },
  EyeOff: { phosphor: 'EyeSlash', heroicons: 'EyeSlashIcon', tabler: 'IconEyeOff' },
  Lock: { phosphor: 'Lock', heroicons: 'LockClosedIcon', tabler: 'IconLock' },
  Unlock: { phosphor: 'LockOpen', heroicons: 'LockOpenIcon', tabler: 'IconLockOpen' },
  Key: { phosphor: 'Key', heroicons: 'KeyIcon', tabler: 'IconKey' },
  Shield: { phosphor: 'Shield', heroicons: 'ShieldCheckIcon', tabler: 'IconShield' },
  AlertCircle: { phosphor: 'WarningCircle', heroicons: 'ExclamationCircleIcon', tabler: 'IconAlertCircle' },
  AlertTriangle: { phosphor: 'Warning', heroicons: 'ExclamationTriangleIcon', tabler: 'IconAlertTriangle' },
  Info: { phosphor: 'Info', heroicons: 'InformationCircleIcon', tabler: 'IconInfoCircle' },
  HelpCircle: { phosphor: 'Question', heroicons: 'QuestionMarkCircleIcon', tabler: 'IconHelp' },
  CircleCheck: { phosphor: 'CheckCircle', heroicons: 'CheckCircleIcon', tabler: 'IconCircleCheck' },
  XCircle: { phosphor: 'XCircle', heroicons: 'XCircleIcon', tabler: 'IconCircleX' },

  // Layout & Design
  AlignJustify: { phosphor: 'TextAlignJustify', heroicons: 'Bars3Icon', tabler: 'IconAlignJustified' },
  AlignLeft: { phosphor: 'TextAlignLeft', heroicons: 'Bars3BottomLeftIcon', tabler: 'IconAlignLeft' },
  AlignCenter: { phosphor: 'TextAlignCenter', heroicons: 'Bars3Icon', tabler: 'IconAlignCenter' },
  AlignRight: { phosphor: 'TextAlignRight', heroicons: 'Bars3BottomRightIcon', tabler: 'IconAlignRight' },
  Grid2x2: { phosphor: 'GridFour', heroicons: 'Squares2x2Icon', tabler: 'IconLayoutGrid' },
  Palette: { phosphor: 'Palette', heroicons: 'SwatchIcon', tabler: 'IconPalette' },
  Type: { phosphor: 'TextAa', heroicons: 'LanguageIcon', tabler: 'IconTypography' },
  Contrast: { phosphor: 'CircleHalf', heroicons: 'SunIcon', tabler: 'IconContrast' },
  Layers: { phosphor: 'Stack', heroicons: 'RectangleStackIcon', tabler: 'IconStack2' },
  Layout: { phosphor: 'Layout', heroicons: 'RectangleGroupIcon', tabler: 'IconLayout' },
  Columns: { phosphor: 'Columns', heroicons: 'ViewColumnsIcon', tabler: 'IconColumns' },
  Maximize: { phosphor: 'ArrowsOut', heroicons: 'ArrowsPointingOutIcon', tabler: 'IconMaximize' },
  Minimize: { phosphor: 'ArrowsIn', heroicons: 'ArrowsPointingInIcon', tabler: 'IconMinimize' },

  // Dev
  Code: { phosphor: 'Code', heroicons: 'CodeBracketIcon', tabler: 'IconCode' },
  Terminal: { phosphor: 'Terminal', heroicons: 'CommandLineIcon', tabler: 'IconTerminal2' },
  Zap: { phosphor: 'Lightning', heroicons: 'BoltIcon', tabler: 'IconBolt' },
  Bug: { phosphor: 'Bug', heroicons: 'BugAntIcon', tabler: 'IconBug' },

  // Media
  Image: { phosphor: 'Image', heroicons: 'PhotoIcon', tabler: 'IconPhoto' },
  Camera: { phosphor: 'Camera', heroicons: 'CameraIcon', tabler: 'IconCamera' },
  Play: { phosphor: 'Play', heroicons: 'PlayIcon', tabler: 'IconPlayerPlay' },
  Pause: { phosphor: 'Pause', heroicons: 'PauseIcon', tabler: 'IconPlayerPause' },
  Music: { phosphor: 'MusicNotes', heroicons: 'MusicalNoteIcon', tabler: 'IconMusic' },
  Mic: { phosphor: 'Microphone', heroicons: 'MicrophoneIcon', tabler: 'IconMicrophone' },
  Volume2: { phosphor: 'SpeakerHigh', heroicons: 'SpeakerWaveIcon', tabler: 'IconVolume' },

  // Nature & Time
  Calendar: { phosphor: 'Calendar', heroicons: 'CalendarIcon', tabler: 'IconCalendar' },
  Clock: { phosphor: 'Clock', heroicons: 'ClockIcon', tabler: 'IconClock' },
  MapPin: { phosphor: 'MapPin', heroicons: 'MapPinIcon', tabler: 'IconMapPin' },
  Navigation: { phosphor: 'NavigationArrow', heroicons: 'MapIcon', tabler: 'IconNavigation' },
  Sun: { phosphor: 'Sun', heroicons: 'SunIcon', tabler: 'IconSun' },
  Moon: { phosphor: 'Moon', heroicons: 'MoonIcon', tabler: 'IconMoon' },
  Cloud: { phosphor: 'Cloud', heroicons: 'CloudIcon', tabler: 'IconCloud' },
  Wifi: { phosphor: 'WifiHigh', heroicons: 'WifiIcon', tabler: 'IconWifi' },

  // Misc
  Sparkles: { phosphor: 'Sparkle', heroicons: 'SparklesIcon', tabler: 'IconSparkles' },
  Lightbulb: { phosphor: 'Lightbulb', heroicons: 'LightBulbIcon', tabler: 'IconBulb' },
  Flag: { phosphor: 'Flag', heroicons: 'FlagIcon', tabler: 'IconFlag' },
  Award: { phosphor: 'Trophy', heroicons: 'TrophyIcon', tabler: 'IconAward' },
  Printer: { phosphor: 'Printer', heroicons: 'PrinterIcon', tabler: 'IconPrinter' },
  QrCode: { phosphor: 'QrCode', heroicons: 'QrCodeIcon', tabler: 'IconQrcode' },
};

// Build reverse maps: library-native-name → lucide-canonical-name
const reverseMaps: Partial<Record<IconLibrary, Record<string, string>>> = {};
for (const [lucideName, mappings] of Object.entries(NAME_MAP)) {
  for (const [lib, nativeName] of Object.entries(mappings)) {
    const libKey = lib as IconLibrary;
    if (!reverseMaps[libKey]) reverseMaps[libKey] = {};
    reverseMaps[libKey]![nativeName] = lucideName;
  }
}

// Cached registries
const registryCache: Partial<Record<IconLibrary, Record<string, IconComp>>> = {
  lucide: lucideIcons as unknown as Record<string, IconComp>,
};

function isIconExport(key: string, val: unknown): boolean {
  if (!/^[A-Z]/.test(key)) return false;
  if (typeof val === 'function') return true;
  // React.forwardRef / React.memo return objects with $$typeof
  if (typeof val === 'object' && val !== null && '$$typeof' in val) return true;
  return false;
}

const NON_ICON_EXPORTS = new Set([
  'IconContext', 'IconBase', 'SSR', 'IconWeight',
  'createReactComponent', 'default',
]);

export async function loadLibrary(lib: IconLibrary): Promise<void> {
  if (registryCache[lib]) return;

  switch (lib) {
    case 'lucide':
      registryCache.lucide = lucideIcons as unknown as Record<string, IconComp>;
      break;
    case 'phosphor': {
      const mod = await import('@phosphor-icons/react');
      const icons: Record<string, IconComp> = {};
      for (const [key, val] of Object.entries(mod)) {
        if (isIconExport(key, val) && !NON_ICON_EXPORTS.has(key)) {
          icons[key] = val as IconComp;
        }
      }
      registryCache.phosphor = icons;
      break;
    }
    case 'heroicons': {
      const mod = await import('@heroicons/react/24/outline');
      const icons: Record<string, IconComp> = {};
      for (const [key, val] of Object.entries(mod)) {
        if (isIconExport(key, val) && key.endsWith('Icon')) {
          icons[key] = val as IconComp;
        }
      }
      registryCache.heroicons = icons;
      break;
    }
    case 'tabler': {
      const mod = await import('@tabler/icons-react');
      const icons: Record<string, IconComp> = {};
      for (const [key, val] of Object.entries(mod)) {
        if (isIconExport(key, val) && key.startsWith('Icon') && key.length > 4 && !NON_ICON_EXPORTS.has(key)) {
          icons[key] = val as IconComp;
        }
      }
      registryCache.tabler = icons;
      break;
    }
  }
}

export function resolveIcon(
  lucideName: string,
  library: IconLibrary,
): { component: IconComp; isHeroicon: boolean } | null {
  if (!lucideName || lucideName === 'none') return null;

  const registry = registryCache[library];

  // If library isn't loaded yet, fall back to Lucide
  if (!registry) {
    const comp = registryCache.lucide?.[lucideName] as IconComp | undefined;
    return comp ? { component: comp, isHeroicon: false } : null;
  }

  const isHeroicon = library === 'heroicons';

  // For lucide, direct lookup
  if (library === 'lucide') {
    const comp = registry[lucideName];
    return comp ? { component: comp, isHeroicon: false } : null;
  }

  // Check cross-library mapping
  const mapping = NAME_MAP[lucideName];
  if (mapping?.[library]) {
    const comp = registry[mapping[library]!];
    if (comp) return { component: comp, isHeroicon };
  }

  // Fallback: try same name in the library registry
  if (registry[lucideName]) {
    return { component: registry[lucideName], isHeroicon };
  }

  // Final fallback: Lucide
  const lucideComp = registryCache.lucide?.[lucideName] as IconComp | undefined;
  return lucideComp ? { component: lucideComp, isHeroicon: false } : null;
}

// Get all icons for IconPicker, keyed by Lucide-canonical name where possible
export function getIconsForPicker(library: IconLibrary): Record<string, IconComp> {
  const registry = registryCache[library];
  if (!registry) return (registryCache.lucide || {}) as Record<string, IconComp>;
  if (library === 'lucide') return registry;

  const result: Record<string, IconComp> = {};
  const reverseMap = reverseMaps[library] || {};

  for (const [nativeName, component] of Object.entries(registry)) {
    const lucideName = reverseMap[nativeName];
    result[lucideName || nativeName] = component;
  }

  return result;
}
