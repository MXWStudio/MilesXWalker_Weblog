import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并 Tailwind CSS 类名的工具函数
 * @param inputs - 要合并的类名数组
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * TypeScript 工具类型：获取对象类型的所有可能值类型
 * @example
 * type Colors = { primary: 'red'; secondary: 'blue' };
 * type ColorValues = ObjectValues<Colors>; // 'red' | 'blue'
 */
export type ObjectValues<T> = T[keyof T]; 