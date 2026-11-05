import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { fetchApi } from '@/api/client';

import { type CreateUserBody } from '@AnAwesomeWave/shared';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'success' | 'error';
  data?: any;
  error?: string;
  timestamp: string;
}

export default function DbTestScreen() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (result: Omit<TestResult, 'timestamp'>) => {
    setResults(prev => [{
      ...result,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev]);
  };

  const testEndpoint = async (
    endpoint: string,
    method: string,
    body?: any
  ) => {
    console.log('Testing', endpoint);
    setLoading(true);
    try {
      const data = await fetchApi(endpoint, {
        method,
        ...(body && { body: JSON.stringify(body) })
      });
      console.log('data:', data);
      
      addResult({
        endpoint,
        method,
        status: 'success',
        data
      });
      
      Alert.alert('Success', JSON.stringify(data, null, 2));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addResult({
        endpoint,
        method,
        status: 'error',
        error: errorMsg
      });
      
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const TestButton = ({ 
    label, 
    onPress, 
    color = '#007AFF' 
  }: { 
    label: string; 
    onPress: () => void; 
    color?: string;
  }) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Database Test Screen</Text>
        <Text style={styles.subtitle}>Tap buttons to test API endpoints</Text>
      </View>

      {/* User Endpoints */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 User Endpoints</Text>
        
        <TestButton
          label="Create User /user"
          onPress={() => testEndpoint('/example/user', 'POST', {})}
        />
        
        <TestButton
          label="Get All Users /users"
          onPress={() => testEndpoint('/example/users', 'GET')}
        />
      </View>

      {/* Party Endpoints */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎉 Party Endpoints</Text>
        
        <TestButton
          label="Create Party (Random Code) /party"
          onPress={() => testEndpoint('/example/party', 'POST')}
          color="#FF9500"
        />
        
        <TestButton
          label="Create Party (Code: TEST123) /party"
          onPress={() => testEndpoint('/example/party', 'POST', { joinCode: 'TEST123' })}
          color="#FF9500"
        />
        
        <TestButton
          label="Get All Parties /parties"
          onPress={() => testEndpoint('/example/parties', 'GET')}
          color="#FF9500"
        />
      </View>

      {/* Participant Endpoints */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👥 Participant Endpoints</Text>
        
        <TestButton
          label="Get All Participants /participants"
          onPress={() => testEndpoint('/example/participants', 'GET')}
          color="#34C759"
        />
      </View>

      {/* Combo Endpoints */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Combo Endpoints</Text>
        
        <TestButton
          label="Create Party + Operator /party-with-operator"
          onPress={() => testEndpoint('/example/party-with-operator', 'POST')}
          color="#5856D6"
        />
        
        <TestButton
          label="Create Party + Operator (Code: COMBO123) /party-with-operator"
          onPress={() => testEndpoint('/example/party-with-operator', 'POST', { joinCode: 'COMBO123' })}
          color="#5856D6"
        />
      </View>

      {/* Utility */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧹 Utility</Text>
        
        <TestButton
          label="⚠️ Delete All Data /cleanup"
          onPress={() => {
            Alert.alert(
              'Confirm Deletion',
              'This will delete all users, parties, and participants. Continue?',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Delete All', 
                  style: 'destructive',
                  onPress: () => testEndpoint('/example/cleanup', 'DELETE')
                }
              ]
            );
          }}
          color="#FF3B30"
        />
        
        <TestButton
          label="Clear Results Log"
          onPress={() => setResults([])}
          color="#8E8E93"
        />
      </View>

      {/* Results Log */}
      {results.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Recent Results ({results.length})</Text>
          
          {results.map((result, index) => (
            <View 
              key={index} 
              style={[
                styles.resultItem,
                result.status === 'error' && styles.resultError
              ]}
            >
              <View style={styles.resultHeader}>
                <Text style={styles.resultMethod}>{result.method}</Text>
                <Text style={styles.resultEndpoint}>{result.endpoint}</Text>
                <Text style={styles.resultTime}>{result.timestamp}</Text>
              </View>
              
              {result.status === 'success' ? (
                <Text style={styles.resultSuccess}>✓ Success</Text>
              ) : (
                <Text style={styles.resultErrorText}>✗ {result.error}</Text>
              )}
              
              {result.data && (
                <Text style={styles.resultData} numberOfLines={3}>
                  {JSON.stringify(result.data, null, 2)}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  button: {
    marginHorizontal: 16,
    marginVertical: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultItem: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#34C759',
  },
  resultError: {
    borderLeftColor: '#FF3B30',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  resultMethod: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007AFF',
    backgroundColor: '#E5F2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  resultEndpoint: {
    fontSize: 12,
    color: '#3C3C43',
    flex: 1,
    fontFamily: 'monospace',
  },
  resultTime: {
    fontSize: 11,
    color: '#8E8E93',
  },
  resultSuccess: {
    fontSize: 13,
    fontWeight: '600',
    color: '#34C759',
    marginBottom: 4,
  },
  resultErrorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 4,
  },
  resultData: {
    fontSize: 11,
    color: '#3C3C43',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  footer: {
    height: 40,
  },
});
