import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark p-8">
          <Text className="text-2xl font-serif font-bold text-text dark:text-text-dark mb-4">
            Algo salió mal
          </Text>
          <Text className="text-base text-muted dark:text-muted-dark text-center mb-6">
            Ocurrió un error inesperado. Puedes intentar recargar la aplicación.
          </Text>
          <TouchableOpacity
            onPress={() => this.setState({ hasError: false, error: null })}
            className="px-8 py-4 rounded-2xl bg-primary dark:bg-primary-dark"
          >
            <Text className="text-white font-bold text-base">Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
