// @flow
import React from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar } from 'react-native';

import { Camera, CameraFocusArea } from '@jonbrennecke/react-native-camera';
import { Navigation } from 'react-native-navigation';

import { wrapWithCameraScreenState } from './cameraScreenState';
import { CameraScreenOnboarding } from './CameraScreenOnboarding';
import { CameraCaptureButton } from './CameraCaptureButton';
import { ThumbnailButton } from './ThumbnailButton';
import {
  CameraFormatModal,
  IconButton,
  BlurredSelectableButton,
  RangeInput,
} from '../../components';
import { SwitchCameraIcon } from '../../components/icons';
import {
  Units,
  ScreenParams,
  Screens,
  BlurApertureRange,
  Colors,
} from '../../constants';

import type { ComponentType } from 'react';

import type { Style } from '../../types';

export type CameraScreenProps = {
  style?: ?Style,
  componentId?: ?string,
};

const styles = {
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.solid.extraDark,
  },
  absoluteFill: StyleSheet.absoluteFillObject,
  contentWrap: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bottomControls: {
    flexDirection: 'column',
  },
  cameraWrap: {
    flex: 1,
    width: '100%',
    borderRadius: Units.small,
    overflow: 'hidden',
  },
  cameraControlsRow: {
    paddingBottom: Units.small,
    paddingTop: Units.medium,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureRowItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topToolbar: {
    paddingVertical: Units.small,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  iconButton: {
    height: Units.large,
    width: Units.large,
  },
  overCameraToolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: Units.small,
    paddingVertical: 2 * Units.extraSmall,
  },
  range: {
    width: '100%',
  },
  rangeToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};

const pushReviewScreen = currentComponentId => {
  Navigation.push(currentComponentId, ScreenParams[Screens.VideoReviewScreen]);
};

// eslint-disable-next-line flowtype/generic-spacing
export const CameraScreen: ComponentType<
  CameraScreenProps
> = wrapWithCameraScreenState(
  ({
    style,
    componentId,
    thumbnailAssetID,
    cameraRef,
    isFormatModalVisible,
    isDepthPreviewEnabled,
    stopCapture,
    startCapture,
    format,
    updateFormat,
    supportedFormats,
    hasCameraPermissions,
    requestCameraPermissions,
    dismissCameraFormatModal,
    enableDepthPreview,
    disableDepthPreview,
    setBlurAperture,
    blurAperture,
    cameraPosition,
    switchCameraPosition,
  }) => (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle="light-content" />
      <CameraScreenOnboarding
        style={styles.contentWrap}
        hasCameraPermissions={hasCameraPermissions}
        onRequestCameraPermissions={requestCameraPermissions}
      >
        <View style={styles.cameraWrap}>
          <Camera
            style={styles.flex}
            ref={cameraRef}
            cameraPosition={cameraPosition}
            previewMode={isDepthPreviewEnabled ? 'depth' : 'portraitMode'}
            resizeMode="scaleAspectWidth"
            blurAperture={blurAperture}
          />
          <CameraFocusArea
            style={styles.absoluteFill}
            onRequestFocus={point => {
              if (cameraRef && cameraRef.current) {
                cameraRef.current.focusOnPoint(point);
              }
            }}
          />
          <View style={styles.overCameraToolbar}>
            <BlurredSelectableButton
              text="Depth"
              isSelected={isDepthPreviewEnabled}
              onPress={
                isDepthPreviewEnabled ? disableDepthPreview : enableDepthPreview
              }
            />
            <View style={styles.rangeToolbar}>
              <RangeInput
                style={styles.range}
                value={blurAperture || BlurApertureRange.initialValue}
                min={BlurApertureRange.lowerBound}
                max={BlurApertureRange.upperBound}
                onSelectValue={setBlurAperture}
              />
            </View>
          </View>
        </View>
        <View style={styles.bottomControls}>
          <View style={styles.cameraControlsRow}>
            <View style={styles.captureRowItem}>
              <ThumbnailButton
                assetID={thumbnailAssetID}
                onPress={() => pushReviewScreen(componentId)}
              />
            </View>
            <View style={styles.captureRowItem}>
              <CameraCaptureButton
                onRequestBeginCapture={startCapture}
                onRequestEndCapture={() =>
                  stopCapture({
                    saveToCameraRoll: true,
                  })
                }
              />
            </View>
            <View style={styles.captureRowItem}>
              <IconButton
                style={styles.iconButton}
                fillColor={Colors.icons.toolbar}
                onPress={switchCameraPosition}
                icon={SwitchCameraIcon}
              />
            </View>
          </View>
        </View>
      </CameraScreenOnboarding>
      <CameraFormatModal
        activeFormat={format}
        supportedFormats={supportedFormats}
        isVisible={isFormatModalVisible}
        onRequestDismissModal={dismissCameraFormatModal}
        onRequestUpdateFormat={updateFormat}
      />
    </SafeAreaView>
  )
);
