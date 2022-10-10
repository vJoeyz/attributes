export interface LaunchDarklyAttributes {
  devClientId: string | null | undefined;
  prodClientId: string | null | undefined;
  eventsToTrack?: string | string[] | null | undefined;
}
