import 'package:flutter/material.dart';

class AppTheme {
  static const Color saudiGreen = Color(0xFF006C35);
  static const Color gold = Color(0xFFD4AF37);
  static const Color backgroundWhite = Colors.white;

  // Modern Arabic font (example fallback if real font isn't loaded)
  static const String arabicFontFamily = 'Cairo';

  // Modern Chinese font
  static const String chineseFontFamily = 'NotoSansSC';

  static ThemeData get lightTheme {
    return ThemeData(
      primaryColor: saudiGreen,
      scaffoldBackgroundColor: backgroundWhite,
      colorScheme: const ColorScheme.light(
        primary: saudiGreen,
        secondary: gold,
        surface: backgroundWhite,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: saudiGreen,
        foregroundColor: Colors.white,
        centerTitle: true,
        elevation: 0,
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: saudiGreen,
        selectedItemColor: gold,
        unselectedItemColor: Colors.white70,
        type: BottomNavigationBarType.fixed,
        elevation: 10,
      ),
      textTheme: const TextTheme(
        displayLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
        titleLarge: TextStyle(fontSize: 22, fontWeight: FontWeight.w600),
        bodyLarge: TextStyle(fontSize: 18, color: Colors.black87),
        bodyMedium: TextStyle(fontSize: 16, color: Colors.black54),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.grey[100],
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: saudiGreen, width: 2),
        ),
        hintStyle: const TextStyle(color: Colors.black38),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: saudiGreen,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
          textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  // Typography helpers
  static TextStyle get arabicTextStyle => const TextStyle(
        fontFamily: arabicFontFamily,
        fontSize: 20,
        height: 1.5,
        color: Colors.black87,
      );

  static TextStyle get chineseTextStyle => const TextStyle(
        fontFamily: chineseFontFamily,
        fontSize: 18,
        height: 1.4,
        color: Colors.black87,
      );
}
