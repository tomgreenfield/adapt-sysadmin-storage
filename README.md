# adapt-sysadmin-storage

An authoring tool plugin to display storage usage.

![](https://user-images.githubusercontent.com/922987/62214165-6870be00-b39c-11e9-8f77-78b463b1f4c6.png)

## Installation

Note: requires [adapt-sysadmin](https://github.com/taylortom/adapt-sysadmin) to be installed.

* Copy all sub-folders in `routes` to `routes` in your authoring tool folder.
* Copy all sub-folders in `frontend` to `frontend/src/plugins`.
* Run an appropriate Grunt task.
* Optionally, set a soft limit by adding the following attribute to `config.json`:
```json
"storageLimit": "2GB"
```
