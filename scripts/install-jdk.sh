#!/usr/bin/env bash
# Install the course's pinned toolchain, as on a learner's machine: OpenJDK 25 (java, javac, jshell,
# javap, jstack, jlink all from ONE JDK) and Apache Maven 3.9.16 (Course 9 on).
# Usable as a cloud environment's setup script. Needs network access to archive.ubuntu.com and
# repo.maven.apache.org (adoptium.net and github.com are blocked in the cloud environment).
#
# Every tool is checked by name after install: a machine with an older JDK keeps it registered in
# update-alternatives, and `javac` from 21 beside `java` from 25 compiles class files the replay's
# java then runs — a silent mismatch the transcripts would only show as a changed banner.
set -euo pipefail
JDK_PKG=openjdk-25-jdk-headless
JDK_PIN=25.0.4.1+1-1~24.04.4
JDK_VERSION=25.0.4.1
MAVEN=3.9.16
TOOLS=(java javac jshell javap jstack jcmd jlink jar)

JDK_HOME=/usr/lib/jvm/java-25-openjdk-amd64
MAVEN_HOME=/usr/local/apache-maven-$MAVEN
# Checked by where each name RESOLVES, not by `--version`: javap and jstack print no version, and a
# JVM tool prints "Picked up JAVA_TOOL_OPTIONS" first wherever that variable is set.
have_jdk() {
  [[ "$("$JDK_HOME/bin/java" --version 2>/dev/null | head -1)" == "openjdk $JDK_VERSION "* ]] || return 1
  for t in "${TOOLS[@]}"; do [[ "$(readlink -f "$(command -v "$t")")" == "$JDK_HOME/bin/$t" ]] || return 1; done
}
have_maven() { [[ "$(JAVA_HOME=$JDK_HOME "$MAVEN_HOME/bin/mvn" --version 2>/dev/null | grep '^Apache Maven')" == "Apache Maven $MAVEN "* ]]; }

if ! have_jdk; then
  apt-get update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq "$JDK_PKG=$JDK_PIN" >/dev/null
  for t in "${TOOLS[@]}"; do update-alternatives --set "$t" "$JDK_HOME/bin/$t" >/dev/null; done
fi
if ! have_maven; then
  work=$(mktemp -d)
  url=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/$MAVEN/apache-maven-$MAVEN-bin.tar.gz
  curl -fsSL -o "$work/maven.tgz" "$url"
  echo "$(curl -fsSL "$url.sha512" | cut -d' ' -f1)  $work/maven.tgz" | sha512sum -c --quiet
  rm -rf "$MAVEN_HOME"
  tar -xzf "$work/maven.tgz" -C /usr/local
  ln -sf "$MAVEN_HOME/bin/mvn" /usr/local/bin/mvn
  rm -rf "$work"
fi
have_jdk || { echo "✗ a tool does not resolve into $JDK_HOME:"; for t in "${TOOLS[@]}"; do echo "  $t → $(readlink -f "$(command -v "$t")")"; done; exit 1; }
have_maven || { echo "✗ $MAVEN_HOME/bin/mvn is not Maven $MAVEN"; exit 1; }
echo "JDK $JDK_VERSION in $JDK_HOME and Maven $MAVEN in $MAVEN_HOME installed"
# The replay (scripts/spine.py) sets JAVA_HOME and PATH itself, so a machine whose PATH finds another
# mvn or JDK first (JAVA_HOME pointing at 21, /opt/maven ahead of /usr/local/bin) still replays on the pin.
[[ "$(command -v mvn)" == /usr/local/bin/mvn ]] || echo "note: \`mvn\` on this PATH is $(command -v mvn); the replay uses $MAVEN_HOME"
