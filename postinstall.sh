#!/usr/bin/env bash
set -euo pipefail

# this script enables using the github repo as an npm dependency. it should
# not be included in any npm version, and the npm script in package.json
# that calls this script should also be removed before publishing

main () {
  local self
  local self_dir
  local lockfile
  local nvm_path

  self="${BASH_SOURCE[0]}"
  while [ -L "${self}" ]; do
      self_dir="$(cd -P "$(dirname "${self}")" >/dev/null 2>&1 && pwd)"
      self="$(readlink "${self}")"
      [[ ${self} != /* ]] && self="${self_dir}/${self}"
  done
  self="$(readlink -f "${self}")"

  if [[ "${self}" != *"node_modules/@triniti/cms/${self}" ]]; then
      exit 0 # not being used as a dependency
  fi

  lockfile="${self}.lock"
  if [ -f "${lockfile}" ]; then
    exit 0 # prevent infinite recursion
  fi
  touch "${lockfile}"
  trap '[ -f "${lockfile}" ] && rm -f "${lockfile}"' EXIT

  if [ "$(node -v)" != "$(head -n 1 ./.nvmrc)" ]; then
    if [ -n "${NVM_DIR}" ]; then
      nvm_path="${NVM_DIR}/nvm.sh"
    elif [ -f "${HOME}/.nvm/nvm.sh" ]; then
      nvm_path="${HOME}/.nvm/nvm.sh"
    fi

    if [ -n "${nvm_path}" ]; then
      source "${nvm_path}"
      nvm use
    fi
  fi

  npm install || exit 1
  npm run build || exit 1
  find . -mindepth 1 -maxdepth 1 ! -name dist -exec rm -rf {} \;
  mv ./dist/* ./
  rm -rf ./dist
}

main "$@"