react-native-version-increment

## Usage

```
  npx react-native-version-increment --bundle=[bundle-name] --patch
```

Will result in the increment of the patch number of the version 0.0.1 -> 0.0.2

## Arguments

- **`--bundle`** _(flag)_ - Represent the project name (Required for IOS).
- **`--patch`** _(flag)_ - Increment patch.
- **`--minor`** _(flag)_ - Increment minor and reset patch.
- **`--major`** _(flag)_ - Increment major and reset minor and patch.
- **`--version`** _(String)_ - Specify a version and ignore flags.
- **`--help`** _(flag)_ - Shows the help.
