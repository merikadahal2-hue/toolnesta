import React, { useEffect } from 'react';
import { Tool } from '../types';
import { ToolHeader } from '../components/ToolHeader';
import { useApp } from '../context/AppContext';

// Tool components
import { PdfReader } from '../tools/pdf/PdfReader';
import { PdfMerge } from '../tools/pdf/PdfMerge';
import { PdfSplit } from '../tools/pdf/PdfSplit';
import { PdfCompress } from '../tools/pdf/PdfCompress';
import { PdfToImages } from '../tools/pdf/PdfToImages';
import { ImagesToPdf } from '../tools/pdf/ImagesToPdf';

import { ImageResizer } from '../tools/image/ImageResizer';
import { ImageCompressor } from '../tools/image/ImageCompressor';
import { ImageConverter } from '../tools/image/ImageConverter';
import { ImageCropper } from '../tools/image/ImageCropper';

import { BasicCalculator } from '../tools/calculator/BasicCalculator';
import { PercentageCalculator } from '../tools/calculator/PercentageCalculator';
import { AgeCalculator } from '../tools/calculator/AgeCalculator';
import { BmiCalculator } from '../tools/calculator/BmiCalculator';
import { DiscountCalculator } from '../tools/calculator/DiscountCalculator';
import { TaxCalculator } from '../tools/calculator/TaxCalculator';
import { TipCalculator } from '../tools/calculator/TipCalculator';

import { UnitConverter } from '../tools/converter/UnitConverter';
import { CurrencyConverter } from '../tools/converter/CurrencyConverter';

import { WordCounter } from '../tools/text/WordCounter';
import { CaseConverter } from '../tools/text/CaseConverter';
import { RemoveDuplicates } from '../tools/text/RemoveDuplicates';
import { TextSorter } from '../tools/text/TextSorter';
import { TextCleaner } from '../tools/text/TextCleaner';

import { QrGenerator } from '../tools/dev/QrGenerator';
import { PasswordGenerator } from '../tools/dev/PasswordGenerator';
import { UuidGenerator } from '../tools/dev/UuidGenerator';
import { JsonFormatter } from '../tools/dev/JsonFormatter';

import { ColorPicker } from '../tools/color/ColorPicker';
import { HexConverter } from '../tools/color/HexConverter';

import { DateDifference } from '../tools/datetime/DateDifference';
import { Stopwatch } from '../tools/datetime/Stopwatch';
import { CountdownTimer } from '../tools/datetime/CountdownTimer';

interface ToolDetailPageProps {
  tool: Tool;
  onBack: () => void;
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({ tool, onBack }) => {
  const { addRecentTool } = useApp();

  useEffect(() => {
    addRecentTool(tool.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update document title for SEO
    document.title = `${tool.name} – ToolNest Free Online Tools`;
    return () => {
      document.title = 'ToolNest – Free, Fast & Privacy-First Online Tools';
    };
  }, [tool.id]);

  const renderToolComponent = () => {
    switch (tool.id) {
      // PDF Tools
      case 'pdf-reader':
        return <PdfReader />;
      case 'merge-pdf':
        return <PdfMerge />;
      case 'split-pdf':
        return <PdfSplit />;
      case 'compress-pdf':
        return <PdfCompress />;
      case 'pdf-to-images':
        return <PdfToImages />;
      case 'images-to-pdf':
        return <ImagesToPdf />;

      // Image Tools
      case 'image-resizer':
        return <ImageResizer />;
      case 'image-compressor':
        return <ImageCompressor />;
      case 'image-converter':
        return <ImageConverter />;
      case 'image-cropper':
        return <ImageCropper />;

      // Calculators
      case 'calculator':
        return <BasicCalculator />;
      case 'percentage-calculator':
        return <PercentageCalculator />;
      case 'age-calculator':
        return <AgeCalculator />;
      case 'bmi-calculator':
        return <BmiCalculator />;
      case 'discount-calculator':
        return <DiscountCalculator />;
      case 'tax-calculator':
        return <TaxCalculator />;
      case 'tip-calculator':
        return <TipCalculator />;

      // Converters
      case 'unit-converter':
        return <UnitConverter />;
      case 'currency-converter':
        return <CurrencyConverter />;

      // Text Tools
      case 'word-counter':
        return <WordCounter />;
      case 'case-converter':
        return <CaseConverter />;
      case 'remove-duplicates':
        return <RemoveDuplicates />;
      case 'text-sorter':
        return <TextSorter />;
      case 'text-cleaner':
        return <TextCleaner />;

      // Dev & Utilities
      case 'qr-generator':
        return <QrGenerator />;
      case 'password-generator':
        return <PasswordGenerator />;
      case 'uuid-generator':
        return <UuidGenerator />;
      case 'json-formatter':
        return <JsonFormatter />;

      // Color Tools
      case 'color-picker':
        return <ColorPicker />;
      case 'hex-converter':
        return <HexConverter />;

      // Date & Time
      case 'date-difference':
        return <DateDifference />;
      case 'stopwatch':
        return <Stopwatch />;
      case 'timer':
        return <CountdownTimer />;

      default:
        return (
          <div className="p-12 text-center text-slate-500 rounded-2xl border border-slate-200 dark:border-slate-800">
            Tool coming soon.
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <ToolHeader tool={tool} onBack={onBack} />
      <div>{renderToolComponent()}</div>
    </div>
  );
};
