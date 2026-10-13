$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing.Common
$references = @(
  [System.Drawing.Bitmap].Assembly.Location,
  [System.Drawing.Color].Assembly.Location,
  [System.Console].Assembly.Location
)

$processor = @'
using System;
using System.Drawing;
using System.Drawing.Imaging;

public static class NwlLogoExtractor {
  private static double Smooth(double low, double high, double value) {
    double t = Math.Max(0, Math.Min(1, (value - low) / (high - low)));
    return t * t * (3 - 2 * t);
  }

  public static string Run(string input, string output) {
    using (var source = new Bitmap(input))
    using (var rgba = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb)) {
      int left = source.Width, top = source.Height, right = 0, bottom = 0;
      for (int y = 0; y < source.Height; y++) {
        for (int x = 0; x < source.Width; x++) {
          Color pixel = source.GetPixel(x, y);
          double white = Smooth(38, 142, Math.Min(pixel.R, Math.Min(pixel.G, pixel.B)));
          double green = Smooth(3, 55, pixel.G - Math.Max(pixel.R, pixel.B));
          double opacity = Math.Max(white, green);
          int alpha = (int)Math.Round(opacity * 255);
          rgba.SetPixel(x, y, Color.FromArgb(alpha, pixel.R, pixel.G, pixel.B));
          if (opacity >= 0.045) {
            left = Math.Min(left, x); top = Math.Min(top, y);
            right = Math.Max(right, x); bottom = Math.Max(bottom, y);
          }
        }
      }

      const int padding = 18;
      left = Math.Max(0, left - padding); top = Math.Max(0, top - padding);
      right = Math.Min(source.Width - 1, right + padding);
      bottom = Math.Min(source.Height - 1, bottom + padding);
      var bounds = Rectangle.FromLTRB(left, top, right + 1, bottom + 1);
      using (var crop = rgba.Clone(bounds, PixelFormat.Format32bppArgb)) {
        crop.Save(output, ImageFormat.Png);
      }
      return "Saved transparent logo cutout: " + (right - left + 1) + "x" + (bottom - top + 1);
    }
  }
}
'@

if (-not ('NwlLogoExtractor' -as [type])) {
  Add-Type -TypeDefinition $processor -ReferencedAssemblies $references
}
$projectRoot = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $projectRoot 'public\assets\nwl-logo.png'
$outputPath = Join-Path $projectRoot 'public\assets\nwl-logo-cutout.png'
[NwlLogoExtractor]::Run($sourcePath, $outputPath)
