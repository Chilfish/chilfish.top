---
title: Android NDK
date: 2023-06-07
tags: [GPT, android]
---

> What can Android NDK do?

The Android NDK (Native Development Kit) is a toolset that allows developers to use C and C++ code in their Android apps. Here are some of the things the Android NDK can do:

1. Improve app performance: Developers can use the Android NDK to write high-performance code that runs faster than Java code.

2. Access native APIs: The Android NDK allows developers to access native APIs that are not available in Java, such as low-level system functions.

3. Port existing code: Developers can use the Android NDK to port existing C and C++ code to Android, saving time and effort.

4. Develop libraries: The Android NDK can be used to develop shared libraries that can be used by multiple apps.

5. Debug native code: The Android NDK includes tools for debugging native code, making it easier to find and fix bugs.

6. Develop games: The Android NDK is often used to develop high-performance games that require low-level access to the device's hardware.

> So how to use it with Kotlin?

To use the Android NDK with Kotlin, you can follow these steps:

1. Set up the Android NDK: Download and install the Android NDK from the official website. Make sure to add the path to the NDK to your system's PATH environment variable.

2. Create a new Kotlin project: Open Android Studio and create a new Kotlin project.

3. Add the NDK to your project: In your project's build.gradle file, add the following code to the android block:

```
android {
    ...
    externalNativeBuild {
        cmake {
            path "CMakeLists.txt"
        }
    }
}
```

This code tells Android Studio to use CMake to build your native code.

4. Create a CMakeLists.txt file: Create a new file in your project's root directory called CMakeLists.txt. This file tells CMake how to build your native code.

5. Write your native code: Write your native code in C or C++ and place it in a new directory called jni.

6. Build your native code: In Android Studio, go to Build > Make Project to build your native code.

7. Call your native code from Kotlin: In your Kotlin code, use the System.loadLibrary() method to load your native library and call your native functions.

That's it! You can now use the Android NDK with Kotlin to write high-performance native code for your Android app.

> OK, please give some examples

Sure, here are some examples of using the Android NDK with Kotlin:

1. Accessing Native APIs: Suppose you want to access a low-level system function that is not available in the Android SDK. You can use the Android NDK to write a C or C++ function that calls the system function and returns the result to Kotlin. Here is an example of a C++ function that reads the device's battery level:

```
#include <jni.h>
#include <android/api-level.h>
#include <android/battery.h>

extern "C" JNIEXPORT jint JNICALL
Java_com_example_myapp_MainActivity_getBatteryLevel(JNIEnv* env, jobject /* this */) {
    if (android_get_device_api_level() < __ANDROID_API_O__) {
        return -1;
    }
    int status;
    int level;
    android::BatteryManager batteryManager;
    status = batteryManager.getIntProperty(android::BATTERY_PROPERTY_STATUS);
    level = batteryManager.getIntProperty(android::BATTERY_PROPERTY_LEVEL);
    if (status == android::BATTERY_STATUS_UNKNOWN || level < 0) {
        return -1;
    }
    return level;
}
```

In this example, the function gets the device's API level and checks that it is at least Android Oreo (API level 26). It then uses the Android BatteryManager API to get the battery status and level.

To call this function from Kotlin, you would add the following code to your MainActivity class:

```
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val batteryLevel = getBatteryLevel()
        Log.d("MainActivity", "Battery level: $batteryLevel")
    }
    external fun getBatteryLevel(): Int
}
```

The external keyword tells Kotlin that the function is implemented in native code.

2. Porting Existing Code: Suppose you have a C or C++ library that you want to use in your Android app. You can use the Android NDK to port the library to Android and call its functions from Kotlin. Here is an example of using the Android NDK to port the zlib compression library to Android:

```
# CMakeLists.txt
cmake_minimum_required(VERSION 3.4.1)
add_library(zlib SHARED IMPORTED)
set_target_properties(zlib PROPERTIES IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/src/main/jniLibs/${ANDROID_ABI}/libz.so)
add_library(mylib SHARED mylib.c)
target_link_libraries(mylib zlib)
```

In this example, we use CMake to build a shared library called zlib and link it to our own library called mylib. We also specify the location of the zlib library in the jniLibs directory.

To call the functions in mylib from Kotlin, you would add the following code to your MainActivity class:

```
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val result = mylibFunction()
        Log.d("MainActivity", "Result: $result")
    }
    external fun mylibFunction(): Int
}
```

The external keyword tells Kotlin that the function is implemented in native code. The mylibFunction() function would be defined in the mylib.c file and can call any functions in the zlib library.

> And there are lots of built libaraies suffix with ".so" we can use in Android

Yes, that's correct! The Android NDK supports the use of pre-built shared libraries, which have the file extension ".so". These libraries are compiled for a specific CPU architecture and can be used in your Android app without the need to recompile them.

Here are some popular pre-built libraries that you can use in your Android app:

1. OpenCV: OpenCV is a popular computer vision library that provides a wide range of image processing and computer vision algorithms. You can use the pre-built OpenCV library in your Android app to perform tasks like object detection, face recognition, and more.

2. FFmpeg: FFmpeg is a powerful multimedia framework that can be used to decode, encode, transcode, and stream audio and video files. You can use the pre-built FFmpeg library in your Android app to play and manipulate audio and video files.

3. SQLite: SQLite is a lightweight and efficient database engine that is widely used in Android apps. You can use the pre-built SQLite library in your Android app to store and retrieve data from a local database.

4. OpenSSL: OpenSSL is a popular encryption library that provides support for SSL/TLS protocols and cryptographic functions. You can use the pre-built OpenSSL library in your Android app to secure network communications or encrypt files.

To use a pre-built library in your Android app, you need to include the library file in your app's project directory and load it using the System.loadLibrary() method in Kotlin. You also need to make sure that the library is compatible with your app's CPU architecture.
